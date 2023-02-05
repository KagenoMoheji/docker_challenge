export const Footer = (): JSX.Element => {
  return (
    <div className="comp-footer">
      <div className="my-[20px] flex flex-col items-center">
        <div className="my-[20px] w-[90%] h-[4px] bg-gray-700"></div>
        <div className="flex flex-row justify-center items-start">
          <div className="w-[300px] flex flex-col">
            <div>
              <h2 className="text-blue-700">
                Hello Deaf World
              </h2>
            </div>
            <div>
              ©Copyright 2022 Hello Deaf World.<br />
              All rights reserved.
            </div>
          </div>
          <div className="w-[150px] flex flex-col">
            <div>
              <h3>
                Project
              </h3>
            </div>
            <div>
              Official site
            </div>
            <div>
              text text
            </div>
          </div>
          <div className="w-[150px] flex flex-col">
            <div>
              <h3>
                Legal
              </h3>
            </div>
            <div>
              community rule
            </div>
          </div>
          <div className="w-[150px] flex flex-col">
            <div>
              <h3>
                Links
              </h3>
            </div>
            <div>
              Github
            </div>
            <div>
              zenn.dev
            </div>
            <div>
              twitter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
