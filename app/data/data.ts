// type Roles = 'user' | 'admin' | 'moderator';

// type User = {
//   id: number;
//   name: string;
//   blockedBy: number[];
//   roles: Roles[];
// };

// type Task = {
//   id: number;
//   title: string;
//   isFinished: boolean;
//   invitedUsers: User[];
//   userId: number;
// };

// type Commentary = {
//   id: number;
//   userId: number;
//   content: string;
// };

// type PermissionList = {
//   comments: {
//     dataType: Commentary;
//     actions: 'view' | 'create' | 'delete' | 'edit';
//   };
//   tasks: {
//     dataType: Task;
//     actions: 'view' | 'create' | 'delete' | 'edit';
//   };
// };

// type PermissionCheck<Key extends keyof PermissionList> =
//   | boolean
//   | ((user: User, data: PermissionList[Key]['dataType']) => boolean);

// type RolesWithPermission = {
//   [R in Roles]: Partial<{
//     [Key in keyof PermissionList]: Partial<{
//       [Action in PermissionList[Key]['actions']]: PermissionCheck<Key>;
//     }>;
//   }>;
// };

// const RolesWithPermissionList = {
//   admin: {
//     comments: {
//       create: true,
//       delete: true,
//       edit: true,
//       view: true,
//     },
//     tasks: {
//       create: true,
//       delete: true,
//       edit: true,
//       view: true,
//     },
//   },
//   moderator: {
//     comments: {
//       create: true,
//       delete: true,
//       edit: (user, comment) => user.id === comment.id,
//       view: true,
//     },
//     tasks: {
//       create: true,
//       delete: (user, task) => task.isFinished,
//       edit: (user, task) => user.id === task.userId,
//       view: true,
//     },
//   },
//   user: {
//     comments: {
//       create: true,
//       delete: (user, comment) => user.id === comment.userId,
//       edit: (user, comment) => user.id === comment.id,
//       view: (user, comment) => !user.blockedBy.includes(comment.userId),
//     },
//     tasks: {
//       create: true,
//       edit: (user, task) =>
//         user.id === task.userId ||
//         task.invitedUsers.findIndex((userList) => userList.id === user.id) !==
//           -1,
//       delete: (user, task) => user.id === task.id,
//       view: (user, task) =>
//         task.invitedUsers.findIndex((userList) => userList.id === user.id) !==
//         -1,
//     },
//   },
// } satisfies RolesWithPermission;

// export function hasPermission<Resource extends keyof PermissionList>(
//   user: User,
//   resource: Resource,
//   action: PermissionList[Resource]['actions'],
//   data?: PermissionList[Resource]['dataType']
// ) {
//   return user.roles.some((role) => {
//     const permission = (RolesWithPermissionList as RolesWithPermission)[role][resource]?.[action];
//     if (permission == null) return false;

//     if (typeof permission === 'boolean') return permission;
//     return data != null && permission(user, data);
//   });
// }

// type Roles = 'user' | 'admin' | 'moderator';

// type ResourceRoles = 'owner' | 'editor' | 'viewer';

// type Permission = 'view' | 'create' | 'delete' | 'edit';

// type OrgPermission = 'assign' | 'delete' | 'modify' | 'add' | 'kick' | 'view';

// type User = {
//   id: number;
//   name: string;
//   blockedBy: number[];
//   roles:Roles[]
// };

// type Organizations = {
//   id: number;
//   name: string;
//   members: number[];
// };

// type Post = {
//   id: number;
//   title: string;
//   content: string;
//   userId: number;
// };

// type SpreadSheet = {
//   id: number;
//   title: string;
//   content: string;
//   userId: number;
//   isPrivate: boolean;
//   invitedUser: number[];
// };

// type FileType = {
//   id: number;
//   caption: string;
//   userId: number;
//   isPrivate: boolean;
//   invitedUser: number[];
// };

// type ResourcesPermission = {
//   file: {
//     dataType: FileType;
//     actions: Permission;
//   };
//   spreadSheet: {
//     dataType: SpreadSheet;
//     actions: Permission;
//   };
//   post: {
//     dataType: Post;
//     actions: Permission;
//   };
// };

// type CheckOrgPermission =
//   | boolean
//   | ((user: User, org: Organizations) => boolean);

// type UserRolePermission = {
//   [Role in Roles]: Partial<{
//     [Actions in OrgPermission]: CheckOrgPermission;
//   }>;
// };

// type CheckResourcePermission<Key extends keyof ResourcesPermission> =
//   | boolean
//   | ((user: User, data: ResourcesPermission[Key]['dataType']) => boolean);

// type ResourceRolePermission = {
//   [Role in ResourceRoles]: Partial<{
//     [Key in keyof ResourcesPermission]: Partial<{
//       [Actions in ResourcesPermission[Key]['actions']]: CheckResourcePermission<Key>;
//     }>;
//   }>;
// };

// const ResoucersRolesPermissions = {
//   owner: {
//     spreadSheet: {
//       delete: true,
//       edit: true,
//       view: true,
//     },
//     file: {
//       delete: true,
//       edit: true,
//       view: true,
//     },
//     post: {
//       delete: true,
//       edit: true,
//       view: true,
//     },
//   },
//   editor: {
//     spreadSheet: {
//       edit: true,
//       view: true,
//     },
//     file: {
//       edit: true,
//       view: true,
//     },
//     post: {
//       edit: true,
//       view: true,
//     },
//   },
//   viewer: {
//     spreadSheet: {
//       view: (user, data) =>
//         data.isPrivate
//           ? data.invitedUser.findIndex((invited) => invited === user.id) !== -1
//           : true,
//     },
//     file: {
//       view: (user, data) =>
//         data.isPrivate
//           ? data.invitedUser.findIndex((invited) => invited === user.id) !== -1
//           : true,
//     },
//     post: {
//       view: (user, data) =>
//         user.blockedBy.findIndex((by) => data.userId === by) === -1,
//     },
//   },
// } as const satisfies ResourceRolePermission;

// const OrganizationsRolesPermission = {
//   admin: {
//     add: true,
//     delete: true,
//     assign: true,
//     modify: true,
//     kick: true,
//     view: true,
//   },
//   moderator: {
//     add: true,
//     kick: true,
//     assign: true,
//     modify: true,
//     view: true,
//   },
//   user: {
//     view: (user, org) =>
//       org.members.findIndex((member) => member === user.id) !== -1,
//   },
// } as const satisfies UserRolePermission;

// function hasResourcePermission<Resource extends keyof ResourcesPermission> (
//     user:User,
//     resource:Resource,
//     actions:ResourcesPermission[Resource]['actions'],
//     data?:ResourcesPermission[Resource]['dataType']
// ){
//     user.
// }

