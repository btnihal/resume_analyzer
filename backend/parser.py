import fitz  # PyMuPDF
from docx import Document

def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extract text from PDF or DOCX file."""
    
    if filename.endswith(".pdf"):
        return extract_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Upload PDF or DOCX.")

def extract_from_pdf(file_bytes: bytes) -> str:
    text = ""
    # Open PDF from bytes
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()

def extract_from_docx(file_bytes: bytes) -> str:
    import io
    doc = Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text.strip()