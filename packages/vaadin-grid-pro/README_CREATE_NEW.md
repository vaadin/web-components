### Creating a new Vaadin Element

1. Clone this repo

        git clone git@github.com:vaadin/vaadin-element-skeleton.git new-element-name

2. When in the `new-element-name` folder, replace all `vaadin-element` and `VaadinElement` occurrences with your new element name.

        perl -pi -e 's,vaadin-element,new-element-name,g' *.* demo/* test/* src/* theme/*/*
        perl -pi -e 's,VaadinElement,NewVaadinElementName,g' *.* demo/* test/* src/* theme/*/*

3. Rename the element

        mv vaadin-element.html new-element-name.html
        mv src/vaadin-element.html src/new-element-name.html
        mv theme/lumo/vaadin-element.html theme/lumo/new-element-name.html
        mv theme/material/vaadin-element.html theme/material/new-element-name.html

4. Check that everything works all right

        npm install
        bower install
        polymer serve

  And check that everything works:

  - http://localhost:8080/components/new-element-name/index.html
  - http://localhost:8080/components/new-element-name/demo/index.html
  - http://localhost:8080/components/new-element-name/test/index.html

5. Remove this README file since it is not needed any more.

        rm README_CREATE_NEW.md

5. Finally, initialize git so as we have an empty history for our `<new-element-name>`

        rm -rf .git
        git init
        git add * .??*
        git commit -m 'First Commit' -a

