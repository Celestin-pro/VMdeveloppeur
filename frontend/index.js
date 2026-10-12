const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createNewDocument() {
    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    appWindow.loadFile(path.join(__dirname, 'app.html'));
}

function openFile() {
    // Logique pour ouvrir un fichier
    ipcMain.on('open-file', (event, arg) => {
        console.log('Ouvrir un fichier:', arg);
    });
}

function saveFile() {
    // Logique pour sauvegarder un fichier
    ipcMain.on('save-file', (event, arg) => {
        console.log('Sauvegarder le fichier:', arg);
    });
}

function showFileMenu() {
    // Implémentation du menu File
    console.log('Afficher le menu File');
}

function showEditMenu() {
    // Implémentation du menu Edit
    console.log('Afficher le menu Edit');
}