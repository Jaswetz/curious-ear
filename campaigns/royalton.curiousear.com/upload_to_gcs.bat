call gsutil -m rm gs://royalton.curiousear.com/**
call gsutil -m cp -c -r . gs://royalton.curiousear.com
call gsutil rm gs://royalton.curiousear.com/dev_server.bat
call gsutil rm gs://royalton.curiousear.com/upload_to_gcs.bat
