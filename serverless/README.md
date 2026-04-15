# Serverless Risk API

This folder contains the AWS Lambda-style handler used to serve precomputed tourist safety risk scores from the ML feature store.

## What it does

The service loads `datasets/feature_store.json` from an S3 bucket, caches it in memory, and exposes lightweight JSON endpoints for area-level risk lookups.

## Files

- `handler.py` - Lambda handler implementation
- `lambda_function.py` - Lambda entry point that re-exports the handler
- `requirements.txt` - Python dependency list for packaging
- `lambda_package/` - bundled deployment package with runtime dependencies

## Endpoints

The handler supports these routes:

- `GET /areas/scores` - returns all area base scores and risk categories
- `POST /score/area` - returns the base score for a single area id

Both endpoints support CORS headers and return JSON responses.

## Environment variables

Set the following environment variable before deploying:

- `MODEL_BUCKET` - S3 bucket that contains `datasets/feature_store.json`

The code uses the `ap-south-1` AWS region in the S3 client.

## Request behavior

- `GET /areas/scores` reads the full cached feature store and returns an `areas` array plus a `total` count.
- `POST /score/area` expects a JSON body with `area_id` and returns the matching precomputed risk score and category.
- Requests with unknown areas return `404`.
- Invalid or missing `area_id` values return `400`.

## Local packaging notes

The `lambda_package/` directory contains the vendored AWS runtime libraries needed to deploy the handler as a self-contained Lambda artifact.

## Related app components

- The backend can proxy these endpoints when an external risk service is configured.
- The mobile app reads the same area scores to show risk levels on the map.
