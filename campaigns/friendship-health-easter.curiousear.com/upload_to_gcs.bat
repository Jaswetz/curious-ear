call gsutil rm gs://friendship-health-easter.curiousear.com/**
call gsutil cp -c -r . gs://friendship-health-easter.curiousear.com
call gsutil rm gs://friendship-health-easter.curiousear.com/dev_server.bat
call gsutil rm gs://friendship-health-easter.curiousear.com/upload_to_gcs.bat
