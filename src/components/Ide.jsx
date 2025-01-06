import React from 'react';
import Split from 'react-split';
import CodeSection from './CodeSection';
import Input from './Input';
import Output from './Output';
import "../styles.css";

const Ide = () => {
  return (
    <div className="h-full flex flex-col w-full">
      <Split
        sizes={[70, 30]} //for code section 70%
        minSize={70}
        gutterSize={10}
        direction="vertical"
        cursor="row-resize"
        className="flex-grow split"
      >
        {/* top pane */}
        <div className="flex-grow">
          <CodeSection />
        </div>

        <div className="h-full">
          <Split
            sizes={[50, 50]} //50% for input and output
            minSize={70}
            gutterSize={10}
            direction="horizontal"
            cursor="col-resize"
            className="flex h-full"
          >
           
            <div className="flex-grow">
              <Input />
            </div>

            <div className="flex-grow">
              <Output />
            </div>
          </Split>
        </div>
      </Split>
    </div>
  );
};

export default Ide;
