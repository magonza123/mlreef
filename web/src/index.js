import React from "react";
import ReactDOM from "react-dom";
import "./css/global-styles.css";
import { Provider } from "react-redux";
import { getProjectsList } from "./actions/projectInfoActions";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist'
import RouterComp from "./Router";
import rootReducer from "./reducers/index";
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { createStore, applyMiddleware } from "redux";
import initialState from "./reducers/initialState";
import thunk from "redux-thunk";

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
let store = createStore(persistedReducer, initialState, applyMiddleware(thunk));
let persistor = persistStore(store);

store.dispatch(getProjectsList());

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      loading={
        <div>
          <h1>
            Loading...
              </h1>
        </div>
      }
      persistor={persistor}>
      <RouterComp store={store} />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
