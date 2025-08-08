import { useState, useEffect, useRef } from "react";

// Pyodide types
interface PyodideInterface {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: any;
  pyodide_py: any;
  version: string;
}

declare global {
  interface Window {
    loadPyodide: (options?: any) => Promise<PyodideInterface>;
  }
}

export interface CodeExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
  isSuccess: boolean;
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  // Initialize Pyodide
  useEffect(() => {
    const initializePyodide = async () => {
      if (pyodideRef.current) return; // Already initialized

      setLoading(true);
      setError(null);

      try {
        // Load Pyodide script if not already loaded
        if (!window.loadPyodide) {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
          script.async = true;
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        // Initialize Pyodide
        const pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });

        // Setup Python environment for better output capture
        await pyodideInstance.runPythonAsync(`
import sys
import io
import traceback
from contextlib import redirect_stdout, redirect_stderr

# Custom output capture
class OutputCapture:
    def __init__(self):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
    
    def get_output(self):
        return self.stdout.getvalue()
    
    def get_error(self):
        return self.stderr.getvalue()
    
    def clear(self):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()

# Global output capture instance
output_capture = OutputCapture()

# Safe globals for code execution
safe_globals = {
    '__builtins__': __builtins__,
    'print': print,
    'input': input,
    'len': len,
    'str': str,
    'int': int,
    'float': float,
    'bool': bool,
    'list': list,
    'dict': dict,
    'tuple': tuple,
    'set': set,
    'range': range,
    'enumerate': enumerate,
    'zip': zip,
    'max': max,
    'min': min,
    'sum': sum,
    'abs': abs,
    'round': round,
    'type': type,
}
        `);

        pyodideRef.current = pyodideInstance;
        setPyodide(pyodideInstance);
        console.log("Pyodide initialized successfully");
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to initialize Pyodide";
        setError(errorMsg);
        console.error("Pyodide initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializePyodide();
  }, []);

  // Execute Python code
  const runPython = async (code: string): Promise<CodeExecutionResult> => {
    if (!pyodide) {
      return {
        output: "",
        error: "Pyodide not initialized",
        executionTime: 0,
        isSuccess: false,
      };
    }

    const startTime = performance.now();

    try {
      // Clear previous output
      await pyodide.runPythonAsync(`
output_capture.clear()
      `);

      // Create wrapper code with safe execution
      const cleanCode = (code || "").replace(/'/g, "\\'").replace(/"/g, '\\"');
      const wrappedCode = `
try:
    with redirect_stdout(output_capture.stdout), redirect_stderr(output_capture.stderr):
        exec('''${cleanCode}''', safe_globals.copy())
except Exception as e:
    import traceback
    output_capture.stderr.write(traceback.format_exc())
      `;

      // Execute the code
      await pyodide.runPythonAsync(wrappedCode);

      // Get output and errors
      const output = await pyodide.runPythonAsync(
        "output_capture.get_output()"
      );
      const error = await pyodide.runPythonAsync("output_capture.get_error()");

      const executionTime = performance.now() - startTime;

      return {
        output: output || "",
        error: error || null,
        executionTime: Math.round(executionTime),
        isSuccess: !error,
      };
    } catch (err) {
      const executionTime = performance.now() - startTime;
      const errorMsg =
        err instanceof Error ? err.message : "Unknown execution error";

      return {
        output: "",
        error: errorMsg,
        executionTime: Math.round(executionTime),
        isSuccess: false,
      };
    }
  };

  // Run code with input simulation
  const runPythonWithInput = async (
    code: string,
    inputs: string[] = []
  ): Promise<CodeExecutionResult> => {
    if (!pyodide) {
      return {
        output: "",
        error: "Pyodide not initialized",
        executionTime: 0,
        isSuccess: false,
      };
    }

    const startTime = performance.now();

    try {
      // Setup input simulation
      await pyodide.runPythonAsync(`
output_capture.clear()

# Mock input function
input_values = ${JSON.stringify(inputs)}
input_index = 0

def mock_input(prompt=""):
    global input_index
    if input_index < len(input_values):
        value = input_values[input_index]
        input_index += 1
        print(f"{prompt}{value}")  # Show the prompt and input
        return value
    else:
        return ""

# Create execution globals with mock input
exec_globals = globals().copy()
exec_globals['input'] = mock_input
      `);

      // Create wrapper code with safe execution
      const cleanCode = (code || "").replace(/'/g, "\\'").replace(/"/g, '\\"');
      const wrappedCode = `
try:
    with redirect_stdout(output_capture.stdout), redirect_stderr(output_capture.stderr):
        exec('''${cleanCode}''', exec_globals)
except Exception as e:
    import traceback
    output_capture.stderr.write(traceback.format_exc())
      `;

      // Execute the code
      await pyodide.runPythonAsync(wrappedCode);

      // Get results
      const output = await pyodide.runPythonAsync(
        "output_capture.get_output()"
      );
      const error = await pyodide.runPythonAsync("output_capture.get_error()");

      const executionTime = performance.now() - startTime;

      return {
        output: output || "",
        error: error || null,
        executionTime: Math.round(executionTime),
        isSuccess: !error,
      };
    } catch (err) {
      const executionTime = performance.now() - startTime;
      const errorMsg =
        err instanceof Error ? err.message : "Unknown execution error";

      return {
        output: "",
        error: errorMsg,
        executionTime: Math.round(executionTime),
        isSuccess: false,
      };
    }
  };

  // Test code against test cases
  const runTests = async (
    code: string,
    testCases: Array<{
      input: string;
      expectedOutput: string;
      description: string;
    }>
  ) => {
    const results = [];

    for (const testCase of testCases) {
      const inputs = testCase.input
        ? testCase.input.split("\n").filter((i) => i.trim())
        : [];
      const result = await runPythonWithInput(code, inputs);

      // Clean up output for comparison
      const actualOutput = (result.output || "").trim();
      const expectedOutput = (testCase.expectedOutput || "").trim();

      // More flexible output comparison
      const passed =
        actualOutput === expectedOutput ||
        actualOutput.includes(expectedOutput) ||
        actualOutput.replace(/\s+/g, " ") ===
          expectedOutput.replace(/\s+/g, " ");

      results.push({
        testCase,
        passed,
        actualOutput,
        error: result.error,
        executionTime: result.executionTime,
      });
    }

    return results;
  };

  return {
    pyodide,
    loading,
    error,
    isReady: !!pyodide && !loading,
    runPython,
    runPythonWithInput,
    runTests,
  };
};
