from setuptools import setup, find_packages

setup(
    name="meptab",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "aioredis",
        "aiosqlite",
        "fastapi",
        "Jinja2",
        "sqlmodel",
        "uvicorn",
    ],
    extras_require={
        "dev": [
            "pytest",
            "pytest-asyncio",
        ],
    },
    entry_points={
        "console_scripts": [
            "meptab=api:main",
        ],
    },
)