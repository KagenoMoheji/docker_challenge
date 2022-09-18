/*
Storybookのインストール時に生成されるサンプルコードであり，20220918時点ではインストールしていないが参考のために残す．
*/

// import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { Page } from "~~/sample/stories/Page";

const manifest: ComponentMeta<typeof Page> = {
  title: "Example/Page",
  component: Page,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
};
export default manifest;

const Template: ComponentStory<typeof Page> = () => <Page />; // コンポーネントにprops的な属性ある場合は引数にargsを渡して{`...args}`で展開

export const LoggedOut = Template.bind({});

export const LoggedIn = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
LoggedIn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loginButton = await canvas.getByRole("button", { name: /Log in/i });
  await userEvent.click(loginButton);
};
