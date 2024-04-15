import axios from "axios";
import * as vscode from "vscode";

const BASE_URL = "http://localhost:3000/link/";
const API_URL = "https://kodlinc-api.metafron.com/addData";

function getBase64Encoding(text: string): string {
  return Buffer?.from(text).toString("base64");
}

async function transmitEncodedData(base64Encoded: string) {
  const response = await axios.post(API_URL, { base64String: base64Encoded });
  return response.data.uuid;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.kodlinc",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return {};
      }
  
      const selection = editor.document.getText(editor.selection);
      const base64Encoded = getBase64Encoding(selection);
      const uuid = await transmitEncodedData(base64Encoded);
      const url = `${BASE_URL}${uuid}`;

      let openLink = "Open Link";
      vscode.window
        .showInformationMessage(
          "The selected code fragment is copied. If you want to open it from the link, please click Open Link",
          openLink
        )
        .then((selection) => {
          if (selection === openLink) {
            vscode.env.openExternal(vscode.Uri.parse(url));
          }
        });
      vscode.env.clipboard.writeText(url);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
