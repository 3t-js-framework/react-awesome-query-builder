import Immutable from 'immutable';
import clone from 'clone';


/**
 * @param {Immutable.List} path
 * @param {...string} suffix
 */
export const expandTreePath = (path, ...suffix) =>
  path.interpose('children1').withMutations((list) => {
    list.skip(1);
    list.push.apply(list, suffix);
    return list;
  });


/**
 * @param {Immutable.List} path
 * @param {...string} suffix
 */
export const expandTreeSubpath = (path, ...suffix) =>
  path.interpose('children1').withMutations((list) => {
    list.push.apply(list, suffix);
    return list;
  });


/**
 * @param {Immutable.Map} path
 * @param {Immutable.List} path
 */
export const getItemByPath = (tree, path) => {
    let children = new Immutable.OrderedMap({ [tree.get('id')] : tree });
    let res = tree;
    path.forEach((id) => {
        res = children.get(id);
        children = res.get('children1');
    });
    return res;
};


/**
 * Set correct `path` in every item
 * @param {Immutable.Map} tree
 * @return {Immutable.Map} tree
 */
export const fixPathsInTree = (tree) => {
    let newTree = tree;

    function _processNode (item, path, lev) {
        const id = item.get('id');
        const itemPath = path.push(item.get('id'));
        const currItemPath = item.get('path');
        if (!currItemPath || !currItemPath.equals(itemPath)) {
          newTree = newTree.setIn(expandTreePath(itemPath, 'path'), itemPath)
        }

        const children = item.get('children1');
        if (children) {
            children.map((child, childId) => {
                _processNode(child, itemPath, lev + 1);
            });
        }
    };

    _processNode(tree, new Immutable.List(), 0);


    return newTree;
};


/**
 * @param {Immutable.Map} tree
 * @return {Object} {flat, items}
 */
export const getFlatTree = (tree) => {
    let flat = [];
    let items = {};
    let realHeight = 0;

    function _flatizeTree (item, path, insideCollapsed, lev, info) {
        const type = item.get('type');
        const collapsed = item.get('collapsed');
        const id = item.get('id');
        const children = item.get('children1');
        const childrenIds = children ? children.map((child, childId) => childId) : null;

        let itemsBefore = flat.length;
        let top = realHeight;
        flat.push(id);
        if (!insideCollapsed)
            realHeight += 1;
        info.height = (info.height || 0) + 1;
        if (children) {
            let subinfo = {};
            children.map((child, childId) => {
                _flatizeTree(child, path.concat(id), insideCollapsed || collapsed, lev + 1, subinfo);
            });
            if (!collapsed) {
                info.height = (info.height || 0) + (subinfo.height || 0);
            }
        }
        let itemsAfter = flat.length;
        let bottom = realHeight;
        let height = info.height;

        items[id] = {
            type: type,
            parent: path.length ? path[path.length-1] : null,
            path: path.concat(id),
            lev: lev,
            leaf: !children,
            index: itemsBefore,
            id: id,
            children: childrenIds,
            _top: itemsBefore,
            _height: (itemsAfter - itemsBefore),
            top: (insideCollapsed ? null : top),
            height: height,
            bottom: (insideCollapsed ? null : top) + height,
            collapsed: collapsed,
            node: item,
        };
    }

    _flatizeTree(tree, [], false, 0, {});

    for (let i = 0 ; i < flat.length ; i++) {
        let prevId = i > 0 ? flat[i-1] : null;
        let nextId = i < (flat.length-1) ? flat[i+1] : null;
        let item = items[flat[i]];
        item.prev = prevId;
        item.next = nextId;
    }

    return {flat, items};
};


export const getTotalNodesCountInTree = (tree) => {
    if (!tree)
        return -1;
    let cnt = 0;

    function _processNode (item, path, lev) {
        const id = item.get('id');
        const children = item.get('children1');
        cnt++;
        if (children) {
            children.map((child, childId) => {
                _processNode(child, path.concat(id), lev + 1);
            });
        }
    };

    _processNode(tree, [], 0);

    return cnt;
};

export const checkHaveIsGroup = (ruleNodes = {}, fields) => {
    let haveGroupPolicy = false;
    let fieldIsGroup = '';
    const arrNodes = Object.values(ruleNodes);
    const _processCheckGroup = (rules) => {
        // Object.keys(rules).forEach(name => {
        //     const item = rules[name]; 
        //     if(item.children1){
        //         _processCheckGroup(item.children1);
        //     }else if(item.properties && item.properties.field) {
        //         const itemField = fields[item.properties.field];
        //         if(itemField.isGroupPolicy){
        //             haveGroupPolicy = true;
        //         }
        //     }
        // })
        const arrLenght = rules.length;
        for (let index = 0; index < arrLenght; index++) {
            const ruleItem = rules[index];
            const {children1, properties} = ruleItem;
            if(children1) {
                _processCheckGroup(children1);
            }else if (properties && properties.field) {
                const field = fields[properties.field];
                if(field.isGroupPolicy) {
                    haveGroupPolicy = true;
                    fieldIsGroup = properties.field;
                    break;
                }
            }
        }
    }
    _processCheckGroup(arrNodes);
    return {haveGroupPolicy, fieldIsGroup};
}
