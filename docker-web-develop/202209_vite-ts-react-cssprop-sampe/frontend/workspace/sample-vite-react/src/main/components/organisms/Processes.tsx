import {AiFillCheckCircle} from "react-icons/ai";
import {CgRadioChecked, CgRadioCheck} from "react-icons/cg";
import {ProcessType} from "~/store/project";

export type ProcessesPropsType = {
  processes: ProcessType[];
};

export const Processes = (props: ProcessesPropsType): JSX.Element => {
  const compProcesses: JSX.Element[] = [];
  for (let i = 0; i < props.processes.length; i++) {
    const process = props.processes[i];
    compProcesses.push(
      <div className="group flex flex-row" key={i}>
        <div className="flex flex-col items-center mr-[5px]">
          <div className="flex items-center">
            {
              (process.status === "completed")
                ? <AiFillCheckCircle className="text-[40px] text-sky-600" />
                : (process.status === "ongoing")
                  ? <CgRadioChecked className="text-[40px] text-sky-600" />
                  : <CgRadioCheck className="text-[40px] text-gray-400" />
            }
          </div>
          <div className={`group-last:hidden h-full ${(process.status !== "completed") ? "w-[1px] bg-gray-400" : "w-[3px] bg-sky-600"}`}>{/* これが縦線 */}</div>
        </div>
        <div>
          <div className="h-[40px] text-[25px] font-bold flex flex-row items-center">
            {process.process}
          </div>
          {/* WARNING: 連想配列のキーチェックは上でやっておく */}
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          <div className="break-words" dangerouslySetInnerHTML={{__html:  (("detail" in process) && process.detail !== undefined) ? process.detail.replace(/(\r\n|\n|\r)/g, "<br>") : ""}} />
        </div>
      </div>
    );
  }
  return (
    <div className="comp-processes">
      <div>
        {compProcesses}
      </div>
    </div>
  );
};
