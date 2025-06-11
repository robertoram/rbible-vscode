# RBible VS Code Extension

A Visual Studio Code extension for reading and searching the Bible directly from your editor.

## Features

- **Look up Bible verses** (`Cmd+Alt+B`)
  - Quick access to any Bible verse
  - Select from multiple Bible versions
  
- **Compare parallel versions** (`Cmd+Alt+P`)
  - View the same verse in different translations
  - Multiple version selection with checkboxes
  - LBLA and RVR versions pre-selected by default
  
- **Search the Bible** (`Cmd+Alt+S`)
  - Search for words or phrases across the Bible
  - Results displayed in markdown format

## Requirements

- The `rbible` command-line tool must be installed on your system
- macOS, Linux, or Windows operating system

## Installation

Since this is a personal extension, you can install it from the .vsix file:

1. Download the .vsix file
2. In VS Code, open the Command Palette (`Cmd+Shift+P`)
3. Type "Install from VSIX" and select the command
4. Choose the downloaded .vsix file

## Usage

### Looking up a verse
1. Press `Cmd+Alt+B`
2. Enter a reference (e.g., "Juan 3:16")
3. Select a Bible version
4. The verse will appear in a new panel

### Comparing versions
1. Press `Cmd+Alt+P`
2. Enter a reference
3. Select versions using space bar
4. Press Enter to view the comparison

### Searching
1. Press `Cmd+Alt+S`
2. Enter your search term
3. Results will appear in a new panel

## License

This extension is for personal use only.

## Release Notes

### 0.0.1
Initial release with basic functionality:
- Verse lookup
- Parallel versions
- Bible search
