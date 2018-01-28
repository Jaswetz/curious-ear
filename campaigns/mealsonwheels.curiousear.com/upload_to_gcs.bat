call gsutil -m rm gs://mealsonwheels.curiousear.com/**
call gsutil -m cp -c -r . gs://mealsonwheels.curiousear.com
call gsutil rm gs://mealsonwheels.curiousear.com/dev_server.bat
call gsutil rm gs://mealsonwheels.curiousear.com/upload_to_gcs.bat
