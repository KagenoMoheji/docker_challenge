import {useSelector, useDispatch} from "react-redux";
import {sampleSelectors, sampleActions} from "~/store/sample";

export const SampleReduxToolkit = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="comp-samplereduxtoolkit">
      <button onClick={() => dispatch(sampleActions.increment({diff: 1}))}>＋</button>
      <span>{useSelector(sampleSelectors.selectCount())}</span>
      <button onClick={() => dispatch(sampleActions.decrement({diff: 1}))}>－</button>
    </div>
  );
};
