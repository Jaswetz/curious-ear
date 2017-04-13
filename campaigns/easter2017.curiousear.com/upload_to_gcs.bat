call gsutil -m rm gs://easter2017.curiousear.com/**
call gsutil -m cp -c -r . gs://easter2017.curiousear.com
call gsutil rm gs://easter2017.curiousear.com/dev_server.bat
call gsutil rm gs://easter2017.curiousear.com/upload_to_gcs.bat
