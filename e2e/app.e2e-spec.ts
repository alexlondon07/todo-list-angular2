import { TodoListAngular2Page } from './app.po';

describe('todo-list-angular2 App', function() {
  let page: TodoListAngular2Page;

  beforeEach(() => {
    page = new TodoListAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
