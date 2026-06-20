from pathlib import Path

# Folders to exclude
EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "__pycache__",
    ".venv",
    "venv",
    ".idea",
    ".vscode"
}

# Files to exclude
EXCLUDED_FILES = {
    ".DS_Store"
}


def generate_tree(directory, prefix=""):
    items = sorted(directory.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))

    # Filter excluded items
    items = [
        item for item in items
        if item.name not in EXCLUDED_DIRS
        and item.name not in EXCLUDED_FILES
    ]

    for index, item in enumerate(items):
        connector = "└── " if index == len(items) - 1 else "├── "
        print(prefix + connector + item.name)

        if item.is_dir():
            extension = "    " if index == len(items) - 1 else "│   "
            generate_tree(item, prefix + extension)


if __name__ == "__main__":
    root = Path.cwd()

    print(root.name)
    generate_tree(root)