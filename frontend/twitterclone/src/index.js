import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { CopilotKit } from "@copilotkit/react-core";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CopilotKit
      publicApiKey="ck_pub_00828bb5867d63cbfb2bbc6f1352e642"
      chatApiEndpoint="/api/chat"
      apiConfiguration={{ debug: false }}
      showDevConsole={false}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </CopilotKit>
  </React.StrictMode>,
);
