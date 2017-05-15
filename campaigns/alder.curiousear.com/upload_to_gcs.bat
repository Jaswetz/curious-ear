call gsutil -m rm gs://alder.curiousear.com/**
call gsutil -m cp -c -r . gs://alder.curiousear.com
call gsutil rm gs://alder.curiousear.com/dev_server.bat
call gsutil rm gs://alder.curiousear.com/upload_to_gcs.bat
