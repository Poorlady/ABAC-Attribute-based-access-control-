type Roles = 'user' | 'admin' | 'moderator';

type User = {
  id: number;
  name: string;
  blockedBy: number[];
  roles: Roles[];
};

type Task = {
  id: number;
  title: string;
  isFinished: boolean;
  invitedUsers: User[];
  userId: number;
};

type Commentary = {
  id: number;
  userId: number;
  content: string;
};

type PermissionList = {
  comments: {
    dataType: Commentary;
    actions: 'view' | 'create' | 'delete' | 'edit';
  };
  tasks: {
    dataType: Task;
    actions: 'view' | 'create' | 'delete' | 'edit';
  };
};

type PermissionCheck<Key extends keyof PermissionList> =
  | boolean
  | ((user: User, data: PermissionList[Key]['dataType']) => boolean);

type RolesWithPermission = {
  [R in Roles]: Partial<{
    [Key in keyof PermissionList]: Partial<{
      [Action in PermissionList[Key]['actions']]: PermissionCheck<Key>;
    }>;
  }>;
};

const RolesWithPermissionList = {
  admin: {
    comments: {
      create: true,
      delete: true,
      edit: true,
      view: true,
    },
    tasks: {
      create: true,
      delete: true,
      edit: true,
      view: true,
    },
  },
  moderator: {
    comments: {
      create: true,
      delete: true,
      edit: (user, comment) => user.id === comment.id,
      view: true,
    },
    tasks: {
      create: true,
      delete: (user, task) => task.isFinished,
      edit: (user, task) => user.id === task.userId,
      view: true,
    },
  },
  user: {
    comments: {
      create: true,
      delete: (user, comment) => user.id === comment.userId,
      edit: (user, comment) => user.id === comment.id,
      view: (user, comment) => !user.blockedBy.includes(comment.userId),
    },
    tasks: {
      create: true,
      edit: (user, task) =>
        user.id === task.userId ||
        task.invitedUsers.findIndex((userList) => userList.id === user.id) !==
          -1,
      delete: (user, task) => user.id === task.id,
      view: (user, task) =>
        task.invitedUsers.findIndex((userList) => userList.id === user.id) !==
        -1,
    },
  },
} satisfies RolesWithPermission;

export function hasPermission<Resource extends keyof PermissionList>(
  user: User,
  resource: Resource,
  action: PermissionList[Resource]['actions'],
  data?: PermissionList[Resource]['dataType']
) {
  return user.roles.some((role) => {
    const permission = (RolesWithPermissionList as RolesWithPermission)[role][resource]?.[action];
    if (permission == null) return false;

    if (typeof permission === 'boolean') return permission;
    return data != null && permission(user, data);
  });
}
