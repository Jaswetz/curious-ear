call gsutil -m rm gs://roosevelthigh.curiousear.com/**
call gsutil -m cp -c -r . gs://roosevelthigh.curiousear.com
call gsutil rm gs://roosevelthigh.curiousear.com/dev_server.bat
call gsutil rm gs://roosevelthigh.curiousear.com/upload_to_gcs.bat
