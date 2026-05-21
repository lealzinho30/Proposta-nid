#!/usr/bin/env python3
"""Validate index.html structure, internal anchors, and PDF presence."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
PDF = ROOT / "NID_Studio_Proposta_GREMP3.pdf"

REQUIRED_SECTIONS = [
    "capa",
    "sobre",
    "filosofia",
    "escopo",
    "processo",
    "diferenciais",
    "investimento",
    "condicoes",
    "encerramento",
]


class Collector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.hrefs: list[str] = []
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        if attr.get("id"):
            self.ids.add(attr["id"])
        href = attr.get("href")
        if href:
            self.hrefs.append(href)
        if tag == "iframe":
            self.errors.append("iframe encontrado — a proposta deve ser HTML normal, sem painel incorporado.")


def main() -> int:
    if not INDEX.is_file():
        print(f"ERRO: {INDEX} não encontrado")
        return 1
    if not PDF.is_file():
        print(f"ERRO: {PDF} não encontrado")
        return 1

    text = INDEX.read_text(encoding="utf-8")
    if "iframe" in text.lower():
        print("ERRO: index.html contém iframe")
        return 1

    parser = Collector()
    try:
        parser.feed(text)
    except Exception as exc:  # noqa: BLE001
        print(f"ERRO HTMLParser: {exc}")
        return 1

    missing = [s for s in REQUIRED_SECTIONS if s not in parser.ids]
    if missing:
        print(f"ERRO: seções ausentes (id): {', '.join(missing)}")
        return 1

    broken: list[str] = []
    for href in parser.hrefs:
        if href.startswith("#"):
            anchor = href[1:]
            if anchor and anchor not in parser.ids:
                broken.append(href)

    if broken:
        print(f"ERRO: links internos quebrados: {', '.join(sorted(set(broken)))}")
        return 1

    if "NID_Studio_Proposta_GREMP3.pdf" not in text:
        print("ERRO: link para NID_Studio_Proposta_GREMP3.pdf não encontrado")
        return 1

    if not re.search(r"GREMP3", text):
        print("ERRO: conteúdo GREMP3 não encontrado")
        return 1

    print("OK: HTML válido (HTMLParser)")
    print(f"OK: {len(REQUIRED_SECTIONS)} seções com id")
    print(f"OK: PDF presente ({PDF.stat().st_size:,} bytes)")
    print("OK: links internos (#…) resolvidos")
    return 0


if __name__ == "__main__":
    sys.exit(main())
