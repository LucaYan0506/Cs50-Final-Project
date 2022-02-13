# Generated by Django 4.0.1 on 2022-02-13 18:50

from django.db import migrations
import encrypted_model_fields.fields


class Migration(migrations.Migration):

    dependencies = [
        ('to_do_list', '0023_alter_page_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='title',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='page',
            name='title',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='city',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='middle_name',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='state',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True),
        ),
    ]