import yaml
import argparse

# Setup argument parsing
parser = argparse.ArgumentParser()
parser.add_argument('--job', help='Path to job config file')
args = parser.parse_args()

# Load YAML configuration
with open(args.job, 'r') as file:
    config = yaml.safe_load(file)

# Proceed with job execution using config
print(f"Running job: {config}")
