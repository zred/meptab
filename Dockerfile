FROM python:3.9

WORKDIR /app

# Copy only the setup.py file first
COPY setup.py .

# Add verbose output to pip install
RUN pip install --no-cache-dir -v .

# Now copy the rest of the application
COPY . .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
