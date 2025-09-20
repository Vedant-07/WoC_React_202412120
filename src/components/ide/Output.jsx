import { useSelector } from "react-redux";

const Output = () => {
  const output = useSelector((store) => store.ide.output);

  const getOutputContent = () => {
    if (!output) {
      return {
        content: "Output will be displayed here...",
        type: "placeholder",
        status: null
      };
    }

    if (output.stdout) {
      return {
        content: output.stdout,
        type: "success",
        status: "Success"
      };
    }

    if (output.stderr) {
      return {
        content: output.stderr,
        type: "error",
        status: "Error"
      };
    }

    if (output.status || output.compileOutput) {
      return {
        content: `${output.status || ""}\n${output.compileOutput || ""}`,
        type: "warning",
        status: output.status || "Compilation"
      };
    }

    return {
      content: "No output available",
      type: "placeholder",
      status: null
    };
  };

  const { content, type, status } = getOutputContent();

  const getStatusColor = () => {
    switch (type) {
      case "success": return "text-accent-600 bg-accent-50 border-accent-200";
      case "error": return "text-danger-600 bg-danger-50 border-danger-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-secondary-600 bg-secondary-50 border-secondary-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success": return "text-accent-100";
      case "error": return "text-danger-100";
      case "warning": return "text-yellow-100";
      default: return "text-secondary-100";
    }
  };

  return (
    <div className="flex flex-grow h-full flex-col bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-secondary-200 bg-secondary-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h4 className="text-lg font-semibold text-secondary-900">Output</h4>
        </div>
        {status && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {status}
          </div>
        )}
      </div>
      
      {/* Output Area */}
      <div className="flex-grow p-4">
        <textarea
          className={`w-full h-full bg-secondary-900 p-4 rounded-lg border border-secondary-700 font-mono text-sm resize-none ${getTextColor()}`}
          value={content}
          disabled
          readOnly
        />
      </div>
    </div>
  );
};

export default Output;
