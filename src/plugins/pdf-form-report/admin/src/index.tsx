import * as React from "react";
import PdfGenerator from "./components/pdf-generator";

export default {
  register(app: any) {},
  bootstrap(app: any) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "pdf-form-report",
      Component: () => <PdfGenerator />,
    });
  },
};
