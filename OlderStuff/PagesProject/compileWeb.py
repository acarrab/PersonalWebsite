fileName = "Pages.js"
directory = "WebsitePages"

import pexpect, time

def thing_notLast(v):
    it = iter(v)
    last = next(it)
    for val in it:
        yield last, True
        last = val
    yield last, False

class codePrinter():
    def __init__(self, tabs = None):
        self.tabs = 0
        if tabs: self.tabs = tabs
        self.s = ''
        self.tabbing = '    '
    def __call__(self, s, incr = 0):
        if abs(incr) == 1: self.tabs += incr
        self.s += self.tabbing * self.tabs + s + "\n"
        if abs(incr) == 2: self.tabs += int(incr/2)
        self.tabs = max(0, self.tabs)
    def up(self): self.tabs += 1
    def down(self): self.tabs = max(0, self.tabs - 1)

def home(d):
    return ['"{}"'.format(attrName(x))
            for x
            in pexpect.run('ls '+ d).split()
            if x[-4:] == '.htm'][0]
def attrName(page):
    return page.replace('.htm', '').title().replace('_', '')
def title(page):
    return ' '.join(page.replace('.htm','').split('_')).title()
def getEdges(d, page):
    if not page.replace('.htm', '') in set(pexpect.run('ls ' + d).split()):
        return []
    else:
        return ['"{}"'.format(attrName(x))
                for x
                in pexpect.run('ls '+ d + '/' + page.replace('.htm', '')).split()
                if x[-4:] == '.htm']


class JavaScriptGenerator():
    def __init__(self):
        self.p = codePrinter()
    def start(self, d): pass
    def before(self, d, page, notLast, isFinal): pass
    def after(self, d, page, notLast): pass
    def end(self): pass


class DocumentationGenerator(JavaScriptGenerator):
    def __init__(self):
        JavaScriptGenerator.__init__(self)
    def start(self, d):
        self.p('/* Auto-Generated from d "{}"*/'.format(d))
        self.p('/*')
        self.p('Website Structure: ', 2)
    def end(self):
        self.p('*/', -1)
    def before(self, d, page, nl, isFinal):
        self.p('- {}'.format(attrName(page)), 2)
    def after(self, d, page, nl):
        self.p.down()

class FlatGenerator(JavaScriptGenerator):
    def __init__(self):
        JavaScriptGenerator.__init__(self)
    def start(self, d):
        self.p('var basePage = {};\n'.format(home(d)))
        self.p('var pages = {', 2)
    def end(self):
        self.p('};', -1)
    def before(self, d, page, nl, isFinal):
        self.p('{}: {{'.format(attrName(page)), 2)
        self.p('link: "{}",'.format('#!/' + d + '/' + page))
        self.p('title: "{}",'.format(title(page)))
        self.p('edges: [{}]'.format(','.join(getEdges(d, page))))
        self.p('}' + (',' if not isFinal else ''), -1)


class RouteGenerator(JavaScriptGenerator):
    def __init__(self):
        JavaScriptGenerator.__init__(self)
        self.first = True;
    def start(self, d):
        self.p('var app = null;')
        self.p('(function(){', 2)
        self.p('app = angular.module("mainApp", ["ngRoute"]);')
        self.p('app.config(function($routeProvider, $locationProvider) {', 2)
        self.p('$routeProvider', 2)
    def end(self):
        self.p('});', -1)
        self.p('})();', -1)
    def addRule(self, when, to, nl, isFinal):
        self.p('.when("{}", {{ templateUrl: "{}" }})'.format(when, to) + (';' if isFinal else ''))
    def before(self, d, page, nl, isFinal):
        link = d + '/' + page
        pexpect.run('chmod o+r ' + d)
        if self.first:
            self.first = False
            #add in home rule
            self.addRule('/', link, nl, isFinal)
        self.addRule('/'+d+'/'+page, link, nl, isFinal)
    def after(self, d, page, nl): pass




class TreeGenerator(JavaScriptGenerator):
    def __init__(self):
        JavaScriptGenerator.__init__(self)
    def start(self, d):
        self.p('var pageTree = {', 2)
    def end(self):
        self.p('};', -1)
    def before(self, d, page, nl, isFinal):
        self.p('{}: {{'.format(attrName(page)), 2)
        self.p('link: "{}",'.format('#!/' + d + '/' + page))
        self.p('title: "{}",'.format(title(page)))
        self.p('to: {', 2)
    def after(self, d, page, nl):
        self.p('}', -1)
        self.p('}' + (',' if nl else ''), -1)




class recursiveWebGenerator():
    def __init__(self):
        self.jsObjects = [DocumentationGenerator(), FlatGenerator(), TreeGenerator(), RouteGenerator()]
        self.done = False
    def start(self):
        for thing in self.jsObjects: thing.start(directory)
    def end(self):
        for thing in self.jsObjects: thing.end()
    def r(self, d, onLast):
        things = set(pexpect.run('ls ' + d).split())
        pages = [x for x in pexpect.run('ls ' + d).split() if x[-4:] == '.htm']
        for page, nl in thing_notLast(pages):
            isFinal = (onLast
                       and not nl
                       and not page.replace('.htm', '') in things
                       and not len(getEdges(d, page)))
            for thing in self.jsObjects: thing.before(d, page, nl, isFinal)
            if page.replace('.htm', '') in things:
                p = self.r(d + '/' + page.replace('.htm', ''), onLast and not nl)
            for thing in self.jsObjects: thing.after(d, page, nl)
    def get(self):
        if not self.done:
            self.start()
            self.r(directory, True)
            self.end()
            self.done = True
        return '\n'.join([x.p.s for x in self.jsObjects])

#rgen = recursiveWebGenerator()

print('waiting...')

s = recursiveWebGenerator().get()

try: buf = open(fileName, 'r').read()
except: buf = ''

if not s == buf:
    print('Updating Directory Structure...')
    open(fileName, 'w').write(s)
    print('waiting...')
pexpect.run('chmod o+r '+fileName)
