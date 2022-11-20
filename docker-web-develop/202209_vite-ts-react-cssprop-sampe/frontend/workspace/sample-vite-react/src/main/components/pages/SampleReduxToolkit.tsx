import {useSelector, useDispatch} from "react-redux";
import {AiOutlineLoading} from "react-icons/ai";
import {sampleSelectors, sampleActions, sampleThunks} from "~/store/sample";

export const SampleReduxToolkit = (): JSX.Element => {
  const dispatch = useDispatch();
  const count = useSelector(sampleSelectors.selectCount());
  const isLoading = useSelector(sampleSelectors.selectIsLoading());
  const CalcResult = (): JSX.Element => isLoading
    ? <span><AiOutlineLoading className="animate-spin w-10" />Calculating...</span>
    : <span>{count}</span>;
  return (
    <div className="comp-samplereduxtoolkit">
      <button onClick={() => dispatch(sampleActions.increment({diff: 1}))}>＋</button>
      <CalcResult />
      <button onClick={() => dispatch(sampleThunks.slowDecrement({diff: 1}))}>－</button>
    </div>
  );
};
