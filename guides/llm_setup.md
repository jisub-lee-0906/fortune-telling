# Local LLM Setup Guide (N100 Optimized)

To enable the AI Interpretation feature, you need to run a local LLM server.
We use **Ollama** because it is lightweight and supports quantization out of the box.

## 1. Install Ollama
- **Windows**: Download [OllamaSetup.exe](https://ollama.com/download/windows) and install it.
- Verify installation by opening PowerShell and typing:
  ```powershell
  ollama --version
  ```

## 2. Pull the Model (Llama-3 Korean)
For N100 (16GB RAM), we recommend a 4-bit quantized 8B model.
Run the following command in PowerShell:

```powershell
ollama pull llama3
```
*Note: This download is approx 4.7GB.*

## 3. Verify Model
Run the model to check if it works:
```powershell
ollama run llama3 "안녕, 너는 누구니?"
```
If it replies in Korean (or English), it is working.

## 4. Run the App
After Ollama is running (it runs in the background by default on Windows), start the Fortune Telling App:
```powershell
./start.ps1
```
The backend `interpreter.py` will automatically connect to `http://localhost:11434`.
