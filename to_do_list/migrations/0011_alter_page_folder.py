# Generated by Django 4.0.1 on 2022-01-22 15:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('to_do_list', '0010_rename_poster_folder_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='folder',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='pages', to='to_do_list.folder'),
        ),
    ]
