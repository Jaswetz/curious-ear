call gsutil -m rm gs://static.curiousear.com/**
call gsutil -m cp -c -r . gs://static.curiousear.com
call gsutil rm gs://static.curiousear.com/upload_to_gcs.bat
call gsutil rm gs://static.curiousear.com/dev_server.bat
call gsutil rm gs://static.curiousear.com/index.html
