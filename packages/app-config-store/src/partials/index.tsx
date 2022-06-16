/*
 *
 * Component: `AppConfigProvider`.
 *
 */
import { useState, useLayoutEffect } from "react";
import {
  getItemFromStorage,
  normalizeAppStoreLanguageAndDir,
} from "@exsys-patient-insurance/helpers";
import { AppConfigStateType } from "@exsys-patient-insurance/types";
import Store, { initialState } from "../context";

const AppConfigProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, setContext] = useState<AppConfigStateType>(initialState);

  useLayoutEffect(() => {
    let mainStoreData = getItemFromStorage<AppConfigStateType>("userData");
    const { language_id } = mainStoreData || {};

    const { normalizedData, nextDir } =
      normalizeAppStoreLanguageAndDir(language_id);

    if (mainStoreData) {
      mainStoreData = language_id
        ? mainStoreData
        : {
            ...mainStoreData,
            ...normalizedData,
          };

      setContext(() => mainStoreData);
    }

    document.body.setAttribute("dir", nextDir);
  }, []);

  return (
    <Store.Provider
      value={{
        state,
        setAuthValues: setContext,
      }}
    >
      {children}
    </Store.Provider>
  );
};

export default AppConfigProvider;
