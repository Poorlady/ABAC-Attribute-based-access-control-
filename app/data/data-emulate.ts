type Roles = 'user' | 'admin' | 'moderator';

type ResourceRoles = 'owner' | 'editor' | 'viewer';

type Permission = 'view' | 'create' | 'delete' | 'edit';

type OrgPermission = 'assign' | 'delete' | 'modify' | 'add' | 'kick' | 'view';

type User = {
  id: number;
  name: string;
  blockedBy: number[];
};

type Organizations = {
  id: number;
  name: string;
  members: number[];
};

type Post = {
  id: number;
  title: string;
  content: string;
  userId: number;
};

type SpreadSheet = {
  id: number;
  title: string;
  content: string;
  userId: number;
  isPrivate: boolean;
  invitedUser: number[];
};

type FileType = {
  id: number;
  caption: string;
  userId: number;
  isPrivate: boolean;
  invitedUser: number[];
};

type ResourcesPermission = {
  file: {
    dataType: FileType;
    actions: Permission;
  };
  spreadSheet: {
    dataType: SpreadSheet;
    actions: Permission;
  };
  post: {
    dataType: Post;
    actions: Permission;
  };
};

type CheckOrgPermission =
  | boolean
  | ((user: User, org: Organizations) => boolean);

type UserRolePermission = {
  [Role in Roles]: Partial<{
    [Actions in OrgPermission]: CheckOrgPermission;
  }>;
};

type CheckResourcePermission<Key extends keyof ResourcesPermission> =
  | boolean
  | ((user: User, data: ResourcesPermission[Key]['dataType']) => boolean);

type ResourceRolePermission = {
  [Role in ResourceRoles]: Partial<{
    [Key in keyof ResourcesPermission]: Partial<{
      [Actions in ResourcesPermission[Key]['actions']]: CheckResourcePermission<Key>;
    }>;
  }>;
};

const ResoucersRolesPermissions = {
  owner: {
    spreadSheet: {
      delete: true,
      edit: true,
      view: true,
    },
    file: {
      delete: true,
      edit: true,
      view: true,
    },
    post: {
      delete: true,
      edit: true,
      view: true,
    },
  },
  editor: {
    spreadSheet: {
      edit: true,
      view: true,
    },
    file: {
      edit: true,
      view: true,
    },
    post: {
      edit: true,
      view: true,
    },
  },
  viewer: {
    spreadSheet: {
      view: (user, data) =>
        data.isPrivate
          ? data.invitedUser.findIndex((invited) => invited === user.id) !== -1
          : true,
    },
    file: {
      view: (user, data) =>
        data.isPrivate
          ? data.invitedUser.findIndex((invited) => invited === user.id) !== -1
          : true,
    },
    post: {
      view: (user, data) =>
        user.blockedBy.findIndex((by) => data.userId === by) === -1,
    },
  },
} as const satisfies ResourceRolePermission;

const OrganizationsRolesPermission = {
  admin: {
    add: true,
    delete: true,
    assign: true,
    modify: true,
    kick: true,
    view: true,
  },
  moderator: {
    add: true,
    kick: true,
    assign: true,
    modify: true,
    view: true,
  },
  user: {
    view: (user, org) =>
      org.members.findIndex((member) => member === user.id) !== -1,
  },
} as const satisfies UserRolePermission;
