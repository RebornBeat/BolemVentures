from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter(is_safe=True)
def qouted_strings(value):
    return mark_safe(f'"{value}"')

@register.filter(is_safe=True)
def space_to_uscore(value):
    return mark_safe(f'{value.replace(" ", "_")}')