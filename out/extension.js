"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
const BASE_URL = "http://localhost:3000/link/";
const API_URL = "https://kodlinc.metafron.com/addData";
function getBase64Encoding(text) {
    return Buffer?.from(text).toString("base64");
}
async function transmitEncodedData(base64Encoded) {
    const response = await axios_1.default.post(API_URL, { base64String: base64Encoded });
    return response.data.uuid;
}
function getActiveEditorAndFileExtension() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return {};
    }
    const fileUri = editor.document.uri;
    const fileExtension = fileUri.fsPath.split(".").pop();
    return { editor, fileExtension };
}
function activate(context) {
    const disposable = vscode.commands.registerCommand("extension.kodlinc", async () => {
        const { editor, fileExtension } = getActiveEditorAndFileExtension();
        if (!editor) {
            return;
        }
        const selection = editor.document.getText(editor.selection);
        const base64Encoded = getBase64Encoding(selection);
        const uuid = await transmitEncodedData(base64Encoded);
        const languageId = editor.document.languageId;
        const url = `${BASE_URL}${uuid}?fileExtension=${fileExtension}/${languageId}`;
        let openLink = "Open Link";
        vscode.window
            .showInformationMessage("The selected code fragment is copied. If you want to open it from the link, please click Open Link", openLink)
            .then((selection) => {
            if (selection === openLink) {
                vscode.env.openExternal(vscode.Uri.parse(url));
            }
        });
        vscode.env.clipboard.writeText(url);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map