import {useSelector} from "react-redux";
import {AiOutlineLoading} from "react-icons/ai";
import {useAppDispatch} from "~/store";
import {sampleSelectors, sampleActions, sampleThunks} from "~/store/sample";

export const SampleReduxToolkit = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const count = useSelector(sampleSelectors.selectCount());
  const isLoading = useSelector(sampleSelectors.selectIsLoading());
  const CalcResult = (): JSX.Element => isLoading
    ? <span><AiOutlineLoading className="animate-spin w-10" />Calculating...</span>
    : <span>{count}</span>;
  return (
    <div className="comp-samplereduxtoolkit">
      <button onClick={() => dispatch(sampleActions.increment({diff: 1}))}>＋</button>
      <CalcResult />
      <button onClick={() => {
        // Reduxにおける非同期のdispatcherを呼ぶ際は下記のようにeslintチェックの行レベル無効化しておく．一応動く．
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch(sampleThunks.slowDecrement({diff: 1}));
      }}>－</button>
    </div>
  );
};
