// eslint-disable-next-line @typescript-eslint/promise-function-async
export const sleep = (msec: number): Promise<void> => {
  /*
  - Refs
    - https://note.affi-sapo-sv.com/js-sleep.php
  */
  return new Promise((resolve) => setTimeout(resolve, msec));
};
