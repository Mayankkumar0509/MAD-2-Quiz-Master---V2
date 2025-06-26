from jinja2 import Template

def roles_list(roles): # [<Role 1>, <Role 2>,..]
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list # ['admin', 'user']

def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)