"""
Text formatting utilities for LLM outputs
"""
import re

def format_fortune_markdown(text: str) -> str:
    """
    Clean and format LLM-generated fortune text to ensure proper markdown structure.
    
    Args:
        text: Raw text from LLM
        
    Returns:
        Formatted markdown text with consistent headers and spacing
    """
    # Clean up user-disliked terms
    text = text.replace("(Action Item)", "").replace("(ActionItem)", "")

    # Ensure headers are H3
    keywords = ["총운", "재물/직업운", "연애/대인관계", "건강운", "개운법", "총평"]
    
    for key in keywords:
        pattern = re.compile(f"(?:^|\\n)+[:#*\\s]*({re.escape(key)}[(]?.*?[)]?)(?:\\s|[*:])*([^\\n]*)", re.MULTILINE)
        text = pattern.sub(f"\n\n### \\1\n\n\\2", text)
        
    # Clean up excessive newlines
    text = re.sub(r'\n{4,}', '\n\n\n', text)
    
    return text.strip()
