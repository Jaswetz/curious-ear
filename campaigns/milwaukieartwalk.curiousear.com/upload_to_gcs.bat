call gsutil -m rm gs://milwaukieartwalk.curiousear.com/**
call gsutil -m cp -c -r . gs://milwaukieartwalk.curiousear.com
call gsutil rm gs://milwaukieartwalk.curiousear.com/dev_server.bat
call gsutil rm gs://milwaukieartwalk.curiousear.com/upload_to_gcs.bat
