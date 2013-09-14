import sys

FAKOBERKERS_PROJECTS = ['digitasenscia']

for project in FAKOBERKERS_PROJECTS:
    settings_module = __import__("%s.settings" % project, fromlist=["*"])
    for var, value in settings_module.__dict__.items():
        if not var.startswith('__'): setattr(sys.modules[__name__],var,value)

