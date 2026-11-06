
import json
import re
import html
import logging
import urllib.request
import xml.etree.ElementTree as ET

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlparse

# FutureAI RSS 新聞擷取系統

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_FILE = BASE_DIR / "news.json"
MAX_NEWS = 60

RSS_SOURCES = [
    {
        "name": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/"
    },
    {
        "name": "Google AI Blog",
        "url": "https://blog.google/technology/ai/rss/"
    },
    {
        "name": "MIT Technology Review",
        "url": "https://www.technologyreview.com/feed/"
    }
]

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s"
)


def clean_text(value):
    """清除 HTML 標籤及多餘空白。"""
    value = html.unescape(value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    return " ".join(value.split())


def classify_news(title, summary):
    """依標題及摘要進行簡易分類。"""
    content = (title + " " + summary).lower()

    model_keywords = [
        "gpt", "gemini", "claude", "llama",
        "model", "模型", "openai", "deepseek"
    ]

    tool_keywords = [
        "tool", "app", "copilot", "canva",
        "工具", "應用", "assistant"
    ]

    industry_keywords = [
        "investment", "company", "industry",
        "regulation", "policy", "market",
        "產業", "投資", "法規"
    ]

    if any(word in content for word in model_keywords):
        return "模型更新"

    if any(word in content for word in tool_keywords):
        return "AI 工具"

    if any(word in content for word in industry_keywords):
        return "產業趨勢"

    return "其他"


def parse_date(value):
    """將 RSS 日期轉為 ISO 8601 格式。"""
    if not value:
        return datetime.now(timezone.utc).isoformat()

    try:
        dt = parsedate_to_datetime(value)
    except (TypeError, ValueError):
        try:
            dt = datetime.fromisoformat(
                value.replace("Z", "+00:00")
            )
        except ValueError:
            return datetime.now(timezone.utc).isoformat()

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    return dt.astimezone(timezone.utc).isoformat()


def get_text(element, names):
    """依序尋找 XML 子元素文字。"""
    for name in names:
        child = element.find(name)
        if child is not None and child.text:
            return child.text.strip()
    return ""


def get_link(item, atom=False):
    """取得 RSS 或 Atom 的文章連結。"""
    if atom:
        for link in item.findall("{*}link"):
            rel = link.attrib.get("rel", "alternate")
            href = link.attrib.get("href", "")
            if rel == "alternate" and href:
                return href.strip()
        return ""

    return get_text(item, ["link"])


def valid_url(url):
    """僅接受 HTTP / HTTPS 新聞網址。"""
    parsed = urlparse(url)
    return (
        parsed.scheme in ("http", "https")
        and bool(parsed.netloc)
    )


def fetch_source(source):
    """擷取並解析單一 RSS / Atom 來源。"""
    logging.info("讀取來源：%s", source["name"])

    request = urllib.request.Request(
        source["url"],
        headers={
            "User-Agent": "FutureAI-NewsBot/1.0",
            "Accept": "application/rss+xml, "
                      "application/atom+xml, "
                      "application/xml, text/xml"
        }
    )

    with urllib.request.urlopen(
        request, timeout=20
    ) as response:
        xml_data = response.read(3_000_000)

    root = ET.fromstring(xml_data)
    articles = []

    # RSS 2.0
    if root.tag.lower().endswith("rss"):
        items = root.findall("./channel/item")
        atom = False

    # Atom
    elif root.tag.lower().endswith("feed"):
        items = root.findall("{*}entry")
        atom = True

    else:
        logging.warning(
            "不支援的 XML 格式：%s",
            source["name"]
        )
        return []

    for item in items:
        if atom:
            title = get_text(item, ["{*}title"])
            summary = get_text(
                item,
                ["{*}summary", "{*}content"]
            )
            date = get_text(
                item,
                ["{*}published", "{*}updated"]
            )
        else:
            title = get_text(item, ["title"])
            summary = get_text(
                item,
                ["description", "{*}encoded"]
            )
            date = get_text(
                item,
                ["pubDate", "{*}date"]
            )

        title = clean_text(title)
        summary = clean_text(summary)[:220]
        link = get_link(item, atom)

        if not title or not valid_url(link):
            continue

        articles.append({
            "title": title,
            "summary": summary,
            "source": source["name"],
            "date": parse_date(date),
            "url": link,
            "category": classify_news(
                title, summary
            )
        })

    logging.info(
        "%s：取得 %d 則",
        source["name"],
        len(articles)
    )

    return articles


def load_existing():
    """讀取現有新聞，避免來源暫時失效時資料消失。"""
    if not OUTPUT_FILE.exists():
        return []

    try:
        with OUTPUT_FILE.open(
            "r", encoding="utf-8"
        ) as file:
            data = json.load(file)

        return data if isinstance(data, list) else []

    except (OSError, ValueError):
        logging.warning("舊新聞資料無法讀取")
        return []


def main():
    existing = load_existing()
    collected = []

    for source in RSS_SOURCES:
        try:
            collected.extend(fetch_source(source))
        except Exception as error:
            logging.warning(
                "%s 擷取失敗：%s",
                source["name"],
                error
            )

    if not collected:
        logging.warning(
            "沒有取得新文章，保留原本的 news.json"
        )
        return

    # 合併新舊新聞，並依 URL 去除重複
    combined = collected + existing
    unique = {}

    for article in combined:
        url = article.get("url", "")
        if valid_url(url) and url not in unique:
            unique[url] = article

    result = sorted(
        unique.values(),
        key=lambda item: item.get("date", ""),
        reverse=True
    )[:MAX_NEWS]

    with OUTPUT_FILE.open(
        "w", encoding="utf-8"
    ) as file:
        json.dump(
            result,
            file,
            ensure_ascii=False,
            indent=2
        )

    logging.info(
        "成功更新 news.json，共 %d 則新聞",
        len(result)
    )


if __name__ == "__main__":
    main()

