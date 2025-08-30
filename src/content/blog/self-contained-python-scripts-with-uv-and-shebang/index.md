---
title: "Self-Contained Python Scripts with uv and Shebang Lines"
description: "How to create self-contained Python scripts with automatic dependency management using uv."
date: "June 15 2025"
---

I create a fair few scripts in my `~/bin/` directory to automate tasks. Since discovering uv and inline script metadata, I've started using Python far more for these. After reading [Rob Allen's post](https://akrabat.com/using-uv-as-your-shebang-line/) about this technique, I've been using it a lot.

As `~/bin` is on my path, I want to run the script by calling it directly on the command line. To do this, I use this shebang:

```bash
#!/usr/bin/env -S uv run --script
```

The command line will now run `uv run --script` and pass the file as the argument. uv ignores the shebang and then runs the rest of the file as a normal Python file.

Once I've ensured that the script has executable permissions via `chmod a+x {filename}`, I'm now good to go with simple command line scripts written in Python that automatically handle their dependencies!

## Adding Dependencies

The real power comes when your Python script needs dependencies. You can declare them in a fenced code block in a leading comment and uv will parse and install those in a temporary virtual environment before invoking the script:

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "requests",
#     "rich",
# ]
# ///

import requests
from rich.console import Console

console = Console()
response = requests.get("https://api.github.com/users/octocat")
console.print(response.json())
```

This follows [PEP 723](https://packaging.python.org/en/latest/specifications/inline-script-metadata/) for inline script metadata, making your scripts completely self-contained.

## The Magic of `env -S`

The `-S` flag in the shebang line is crucial for portability. It tells `env` to split the arguments properly. When the OS runs your script, it effectively executes:

```bash
/usr/bin/env '-S uv run --script' your_script.py
```

The `-S` flag causes `env` to split this back into separate arguments, making it work correctly across different systems.

## Benefits

This approach gives you several advantages:

- **No virtual environment management**: uv handles temporary environments automatically
- **Dependency isolation**: Each script gets its own dependency environment
- **Portability**: Scripts work anywhere uv is installed
- **Speed**: uv's Rust implementation makes dependency resolution and installation very fast
- **Self-documenting**: Dependencies are declared right in the script

## Reducing Noise

If you find the "Reading inline script metadata" message annoying each time you run the script, you can add `--quiet` to your shebang line:

```bash
#!/usr/bin/env -S uv run --script --quiet
```

## Example Script

Here's a complete example of a useful script that normalizes audio levels in video files:

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# dependencies = [
#     "ffmpeg-python",
# ]
# ///

import sys
import ffmpeg

def normalize_audio(input_file, output_file):
    """Normalize audio levels in a video file."""
    try:
        (
            ffmpeg
            .input(input_file)
            .output(output_file, **{'c:v': 'copy', 'filter:a': 'loudnorm'})
            .overwrite_output()
            .run()
        )
        print(f"Audio normalized: {input_file} -> {output_file}")
    except ffmpeg.Error as e:
        print(f"Error processing {input_file}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: normalize_audio input.mp4 output.mp4")
        sys.exit(1)

    normalize_audio(sys.argv[1], sys.argv[2])
```

Save this as `normalize_audio`, make it executable with `chmod +x normalize_audio`, and you can now run it directly:

```bash
normalize_audio input.mp4 output.mp4
```

## Compatibility Notes

The `env -S` flag works on most modern Linux distributions and recent versions of macOS. However, there are some differences in how different operating systems handle shebang parsing:

- **Linux**: Passes the entire shebang as one argument to `env`
- **macOS**: May split on whitespace differently

For maximum compatibility, stick to simple command lines without quotes or complex arguments in your shebang.

## Getting Started

1. Install uv: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. Create a Python script with the uv shebang line
3. Add your dependencies in the script metadata block
4. Make it executable: `chmod +x your_script`
5. Run it directly: `./your_script`
