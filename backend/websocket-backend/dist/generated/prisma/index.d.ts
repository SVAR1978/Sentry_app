
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model LocationLog
 * 
 */
export type LocationLog = $Result.DefaultSelection<Prisma.$LocationLogPayload>
/**
 * Model EmergencyContact
 * 
 */
export type EmergencyContact = $Result.DefaultSelection<Prisma.$EmergencyContactPayload>
/**
 * Model Itinerary
 * 
 */
export type Itinerary = $Result.DefaultSelection<Prisma.$ItineraryPayload>
/**
 * Model BookingPartner
 * 
 */
export type BookingPartner = $Result.DefaultSelection<Prisma.$BookingPartnerPayload>
/**
 * Model BookingVisit
 * 
 */
export type BookingVisit = $Result.DefaultSelection<Prisma.$BookingVisitPayload>
/**
 * Model SOSAlert
 * 
 */
export type SOSAlert = $Result.DefaultSelection<Prisma.$SOSAlertPayload>
/**
 * Model SupportTicket
 * 
 */
export type SupportTicket = $Result.DefaultSelection<Prisma.$SupportTicketPayload>
/**
 * Model SafetyAlert
 * 
 */
export type SafetyAlert = $Result.DefaultSelection<Prisma.$SafetyAlertPayload>
/**
 * Model SafetyZone
 * 
 */
export type SafetyZone = $Result.DefaultSelection<Prisma.$SafetyZonePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const LocationSource: {
  GPS: 'GPS',
  NETWORK: 'NETWORK'
};

export type LocationSource = (typeof LocationSource)[keyof typeof LocationSource]


export const ItineraryStatus: {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type ItineraryStatus = (typeof ItineraryStatus)[keyof typeof ItineraryStatus]


export const SOSStatus: {
  ACTIVE: 'ACTIVE',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED',
  ESCALATED: 'ESCALATED'
};

export type SOSStatus = (typeof SOSStatus)[keyof typeof SOSStatus]


export const TicketStatus: {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED'
};

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]


export const AlertSeverity: {
  CRITICAL: 'CRITICAL',
  CAUTION: 'CAUTION',
  INFO: 'INFO'
};

export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity]


export const ZoneLevel: {
  SAFE: 'SAFE',
  MODERATE: 'MODERATE',
  AVOID: 'AVOID'
};

export type ZoneLevel = (typeof ZoneLevel)[keyof typeof ZoneLevel]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type LocationSource = $Enums.LocationSource

export const LocationSource: typeof $Enums.LocationSource

export type ItineraryStatus = $Enums.ItineraryStatus

export const ItineraryStatus: typeof $Enums.ItineraryStatus

export type SOSStatus = $Enums.SOSStatus

export const SOSStatus: typeof $Enums.SOSStatus

export type TicketStatus = $Enums.TicketStatus

export const TicketStatus: typeof $Enums.TicketStatus

export type AlertSeverity = $Enums.AlertSeverity

export const AlertSeverity: typeof $Enums.AlertSeverity

export type ZoneLevel = $Enums.ZoneLevel

export const ZoneLevel: typeof $Enums.ZoneLevel

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.locationLog`: Exposes CRUD operations for the **LocationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocationLogs
    * const locationLogs = await prisma.locationLog.findMany()
    * ```
    */
  get locationLog(): Prisma.LocationLogDelegate<ExtArgs>;

  /**
   * `prisma.emergencyContact`: Exposes CRUD operations for the **EmergencyContact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmergencyContacts
    * const emergencyContacts = await prisma.emergencyContact.findMany()
    * ```
    */
  get emergencyContact(): Prisma.EmergencyContactDelegate<ExtArgs>;

  /**
   * `prisma.itinerary`: Exposes CRUD operations for the **Itinerary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Itineraries
    * const itineraries = await prisma.itinerary.findMany()
    * ```
    */
  get itinerary(): Prisma.ItineraryDelegate<ExtArgs>;

  /**
   * `prisma.bookingPartner`: Exposes CRUD operations for the **BookingPartner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingPartners
    * const bookingPartners = await prisma.bookingPartner.findMany()
    * ```
    */
  get bookingPartner(): Prisma.BookingPartnerDelegate<ExtArgs>;

  /**
   * `prisma.bookingVisit`: Exposes CRUD operations for the **BookingVisit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingVisits
    * const bookingVisits = await prisma.bookingVisit.findMany()
    * ```
    */
  get bookingVisit(): Prisma.BookingVisitDelegate<ExtArgs>;

  /**
   * `prisma.sOSAlert`: Exposes CRUD operations for the **SOSAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SOSAlerts
    * const sOSAlerts = await prisma.sOSAlert.findMany()
    * ```
    */
  get sOSAlert(): Prisma.SOSAlertDelegate<ExtArgs>;

  /**
   * `prisma.supportTicket`: Exposes CRUD operations for the **SupportTicket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupportTickets
    * const supportTickets = await prisma.supportTicket.findMany()
    * ```
    */
  get supportTicket(): Prisma.SupportTicketDelegate<ExtArgs>;

  /**
   * `prisma.safetyAlert`: Exposes CRUD operations for the **SafetyAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SafetyAlerts
    * const safetyAlerts = await prisma.safetyAlert.findMany()
    * ```
    */
  get safetyAlert(): Prisma.SafetyAlertDelegate<ExtArgs>;

  /**
   * `prisma.safetyZone`: Exposes CRUD operations for the **SafetyZone** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SafetyZones
    * const safetyZones = await prisma.safetyZone.findMany()
    * ```
    */
  get safetyZone(): Prisma.SafetyZoneDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    LocationLog: 'LocationLog',
    EmergencyContact: 'EmergencyContact',
    Itinerary: 'Itinerary',
    BookingPartner: 'BookingPartner',
    BookingVisit: 'BookingVisit',
    SOSAlert: 'SOSAlert',
    SupportTicket: 'SupportTicket',
    SafetyAlert: 'SafetyAlert',
    SafetyZone: 'SafetyZone'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "locationLog" | "emergencyContact" | "itinerary" | "bookingPartner" | "bookingVisit" | "sOSAlert" | "supportTicket" | "safetyAlert" | "safetyZone"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      LocationLog: {
        payload: Prisma.$LocationLogPayload<ExtArgs>
        fields: Prisma.LocationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          findFirst: {
            args: Prisma.LocationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          findMany: {
            args: Prisma.LocationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>[]
          }
          create: {
            args: Prisma.LocationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          createMany: {
            args: Prisma.LocationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>[]
          }
          delete: {
            args: Prisma.LocationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          update: {
            args: Prisma.LocationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          deleteMany: {
            args: Prisma.LocationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationLogPayload>
          }
          aggregate: {
            args: Prisma.LocationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocationLog>
          }
          groupBy: {
            args: Prisma.LocationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationLogCountArgs<ExtArgs>
            result: $Utils.Optional<LocationLogCountAggregateOutputType> | number
          }
        }
      }
      EmergencyContact: {
        payload: Prisma.$EmergencyContactPayload<ExtArgs>
        fields: Prisma.EmergencyContactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmergencyContactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmergencyContactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          findFirst: {
            args: Prisma.EmergencyContactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmergencyContactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          findMany: {
            args: Prisma.EmergencyContactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>[]
          }
          create: {
            args: Prisma.EmergencyContactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          createMany: {
            args: Prisma.EmergencyContactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmergencyContactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>[]
          }
          delete: {
            args: Prisma.EmergencyContactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          update: {
            args: Prisma.EmergencyContactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          deleteMany: {
            args: Prisma.EmergencyContactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmergencyContactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmergencyContactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          aggregate: {
            args: Prisma.EmergencyContactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmergencyContact>
          }
          groupBy: {
            args: Prisma.EmergencyContactGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmergencyContactGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmergencyContactCountArgs<ExtArgs>
            result: $Utils.Optional<EmergencyContactCountAggregateOutputType> | number
          }
        }
      }
      Itinerary: {
        payload: Prisma.$ItineraryPayload<ExtArgs>
        fields: Prisma.ItineraryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItineraryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItineraryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          findFirst: {
            args: Prisma.ItineraryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItineraryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          findMany: {
            args: Prisma.ItineraryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>[]
          }
          create: {
            args: Prisma.ItineraryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          createMany: {
            args: Prisma.ItineraryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItineraryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>[]
          }
          delete: {
            args: Prisma.ItineraryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          update: {
            args: Prisma.ItineraryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          deleteMany: {
            args: Prisma.ItineraryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItineraryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItineraryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItineraryPayload>
          }
          aggregate: {
            args: Prisma.ItineraryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItinerary>
          }
          groupBy: {
            args: Prisma.ItineraryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItineraryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItineraryCountArgs<ExtArgs>
            result: $Utils.Optional<ItineraryCountAggregateOutputType> | number
          }
        }
      }
      BookingPartner: {
        payload: Prisma.$BookingPartnerPayload<ExtArgs>
        fields: Prisma.BookingPartnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingPartnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingPartnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>
          }
          findFirst: {
            args: Prisma.BookingPartnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingPartnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>
          }
          findMany: {
            args: Prisma.BookingPartnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>[]
          }
          create: {
            args: Prisma.BookingPartnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>
          }
          createMany: {
            args: Prisma.BookingPartnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingPartnerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>[]
          }
          delete: {
            args: Prisma.BookingPartnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>
          }
          update: {
            args: Prisma.BookingPartnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>
          }
          deleteMany: {
            args: Prisma.BookingPartnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingPartnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookingPartnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPartnerPayload>
          }
          aggregate: {
            args: Prisma.BookingPartnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingPartner>
          }
          groupBy: {
            args: Prisma.BookingPartnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingPartnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingPartnerCountArgs<ExtArgs>
            result: $Utils.Optional<BookingPartnerCountAggregateOutputType> | number
          }
        }
      }
      BookingVisit: {
        payload: Prisma.$BookingVisitPayload<ExtArgs>
        fields: Prisma.BookingVisitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingVisitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingVisitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>
          }
          findFirst: {
            args: Prisma.BookingVisitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingVisitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>
          }
          findMany: {
            args: Prisma.BookingVisitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>[]
          }
          create: {
            args: Prisma.BookingVisitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>
          }
          createMany: {
            args: Prisma.BookingVisitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingVisitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>[]
          }
          delete: {
            args: Prisma.BookingVisitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>
          }
          update: {
            args: Prisma.BookingVisitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>
          }
          deleteMany: {
            args: Prisma.BookingVisitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingVisitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookingVisitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingVisitPayload>
          }
          aggregate: {
            args: Prisma.BookingVisitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingVisit>
          }
          groupBy: {
            args: Prisma.BookingVisitGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingVisitGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingVisitCountArgs<ExtArgs>
            result: $Utils.Optional<BookingVisitCountAggregateOutputType> | number
          }
        }
      }
      SOSAlert: {
        payload: Prisma.$SOSAlertPayload<ExtArgs>
        fields: Prisma.SOSAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SOSAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SOSAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>
          }
          findFirst: {
            args: Prisma.SOSAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SOSAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>
          }
          findMany: {
            args: Prisma.SOSAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>[]
          }
          create: {
            args: Prisma.SOSAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>
          }
          createMany: {
            args: Prisma.SOSAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SOSAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>[]
          }
          delete: {
            args: Prisma.SOSAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>
          }
          update: {
            args: Prisma.SOSAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>
          }
          deleteMany: {
            args: Prisma.SOSAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SOSAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SOSAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SOSAlertPayload>
          }
          aggregate: {
            args: Prisma.SOSAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSOSAlert>
          }
          groupBy: {
            args: Prisma.SOSAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<SOSAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.SOSAlertCountArgs<ExtArgs>
            result: $Utils.Optional<SOSAlertCountAggregateOutputType> | number
          }
        }
      }
      SupportTicket: {
        payload: Prisma.$SupportTicketPayload<ExtArgs>
        fields: Prisma.SupportTicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupportTicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupportTicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>
          }
          findFirst: {
            args: Prisma.SupportTicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupportTicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>
          }
          findMany: {
            args: Prisma.SupportTicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>[]
          }
          create: {
            args: Prisma.SupportTicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>
          }
          createMany: {
            args: Prisma.SupportTicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupportTicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>[]
          }
          delete: {
            args: Prisma.SupportTicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>
          }
          update: {
            args: Prisma.SupportTicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>
          }
          deleteMany: {
            args: Prisma.SupportTicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupportTicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SupportTicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupportTicketPayload>
          }
          aggregate: {
            args: Prisma.SupportTicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupportTicket>
          }
          groupBy: {
            args: Prisma.SupportTicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupportTicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupportTicketCountArgs<ExtArgs>
            result: $Utils.Optional<SupportTicketCountAggregateOutputType> | number
          }
        }
      }
      SafetyAlert: {
        payload: Prisma.$SafetyAlertPayload<ExtArgs>
        fields: Prisma.SafetyAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SafetyAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SafetyAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          findFirst: {
            args: Prisma.SafetyAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SafetyAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          findMany: {
            args: Prisma.SafetyAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>[]
          }
          create: {
            args: Prisma.SafetyAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          createMany: {
            args: Prisma.SafetyAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SafetyAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>[]
          }
          delete: {
            args: Prisma.SafetyAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          update: {
            args: Prisma.SafetyAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          deleteMany: {
            args: Prisma.SafetyAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SafetyAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SafetyAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          aggregate: {
            args: Prisma.SafetyAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSafetyAlert>
          }
          groupBy: {
            args: Prisma.SafetyAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<SafetyAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.SafetyAlertCountArgs<ExtArgs>
            result: $Utils.Optional<SafetyAlertCountAggregateOutputType> | number
          }
        }
      }
      SafetyZone: {
        payload: Prisma.$SafetyZonePayload<ExtArgs>
        fields: Prisma.SafetyZoneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SafetyZoneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SafetyZoneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>
          }
          findFirst: {
            args: Prisma.SafetyZoneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SafetyZoneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>
          }
          findMany: {
            args: Prisma.SafetyZoneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>[]
          }
          create: {
            args: Prisma.SafetyZoneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>
          }
          createMany: {
            args: Prisma.SafetyZoneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SafetyZoneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>[]
          }
          delete: {
            args: Prisma.SafetyZoneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>
          }
          update: {
            args: Prisma.SafetyZoneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>
          }
          deleteMany: {
            args: Prisma.SafetyZoneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SafetyZoneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SafetyZoneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyZonePayload>
          }
          aggregate: {
            args: Prisma.SafetyZoneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSafetyZone>
          }
          groupBy: {
            args: Prisma.SafetyZoneGroupByArgs<ExtArgs>
            result: $Utils.Optional<SafetyZoneGroupByOutputType>[]
          }
          count: {
            args: Prisma.SafetyZoneCountArgs<ExtArgs>
            result: $Utils.Optional<SafetyZoneCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    locationLogs: number
    emergencyContacts: number
    itineraries: number
    bookingVisits: number
    supportTickets: number
    sosAlerts: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locationLogs?: boolean | UserCountOutputTypeCountLocationLogsArgs
    emergencyContacts?: boolean | UserCountOutputTypeCountEmergencyContactsArgs
    itineraries?: boolean | UserCountOutputTypeCountItinerariesArgs
    bookingVisits?: boolean | UserCountOutputTypeCountBookingVisitsArgs
    supportTickets?: boolean | UserCountOutputTypeCountSupportTicketsArgs
    sosAlerts?: boolean | UserCountOutputTypeCountSosAlertsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLocationLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEmergencyContactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmergencyContactWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountItinerariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookingVisitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingVisitWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSupportTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupportTicketWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSosAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SOSAlertWhereInput
  }


  /**
   * Count Type BookingPartnerCountOutputType
   */

  export type BookingPartnerCountOutputType = {
    visits: number
  }

  export type BookingPartnerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    visits?: boolean | BookingPartnerCountOutputTypeCountVisitsArgs
  }

  // Custom InputTypes
  /**
   * BookingPartnerCountOutputType without action
   */
  export type BookingPartnerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartnerCountOutputType
     */
    select?: BookingPartnerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookingPartnerCountOutputType without action
   */
  export type BookingPartnerCountOutputTypeCountVisitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingVisitWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.UserRole | null
    avatar: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.UserRole | null
    avatar: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    password: number
    role: number
    avatar: number
    address: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    avatar?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    avatar?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    avatar?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string
    password: string
    role: $Enums.UserRole
    avatar: string | null
    address: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    avatar?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    locationLogs?: boolean | User$locationLogsArgs<ExtArgs>
    emergencyContacts?: boolean | User$emergencyContactsArgs<ExtArgs>
    itineraries?: boolean | User$itinerariesArgs<ExtArgs>
    bookingVisits?: boolean | User$bookingVisitsArgs<ExtArgs>
    supportTickets?: boolean | User$supportTicketsArgs<ExtArgs>
    sosAlerts?: boolean | User$sosAlertsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    avatar?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    avatar?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locationLogs?: boolean | User$locationLogsArgs<ExtArgs>
    emergencyContacts?: boolean | User$emergencyContactsArgs<ExtArgs>
    itineraries?: boolean | User$itinerariesArgs<ExtArgs>
    bookingVisits?: boolean | User$bookingVisitsArgs<ExtArgs>
    supportTickets?: boolean | User$supportTicketsArgs<ExtArgs>
    sosAlerts?: boolean | User$sosAlertsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      locationLogs: Prisma.$LocationLogPayload<ExtArgs>[]
      emergencyContacts: Prisma.$EmergencyContactPayload<ExtArgs>[]
      itineraries: Prisma.$ItineraryPayload<ExtArgs>[]
      bookingVisits: Prisma.$BookingVisitPayload<ExtArgs>[]
      supportTickets: Prisma.$SupportTicketPayload<ExtArgs>[]
      sosAlerts: Prisma.$SOSAlertPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string
      password: string
      role: $Enums.UserRole
      avatar: string | null
      address: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    locationLogs<T extends User$locationLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$locationLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findMany"> | Null>
    emergencyContacts<T extends User$emergencyContactsArgs<ExtArgs> = {}>(args?: Subset<T, User$emergencyContactsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findMany"> | Null>
    itineraries<T extends User$itinerariesArgs<ExtArgs> = {}>(args?: Subset<T, User$itinerariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findMany"> | Null>
    bookingVisits<T extends User$bookingVisitsArgs<ExtArgs> = {}>(args?: Subset<T, User$bookingVisitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findMany"> | Null>
    supportTickets<T extends User$supportTicketsArgs<ExtArgs> = {}>(args?: Subset<T, User$supportTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "findMany"> | Null>
    sosAlerts<T extends User$sosAlertsArgs<ExtArgs> = {}>(args?: Subset<T, User$sosAlertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.locationLogs
   */
  export type User$locationLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    where?: LocationLogWhereInput
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    cursor?: LocationLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * User.emergencyContacts
   */
  export type User$emergencyContactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    where?: EmergencyContactWhereInput
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    cursor?: EmergencyContactWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * User.itineraries
   */
  export type User$itinerariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    where?: ItineraryWhereInput
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    cursor?: ItineraryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * User.bookingVisits
   */
  export type User$bookingVisitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    where?: BookingVisitWhereInput
    orderBy?: BookingVisitOrderByWithRelationInput | BookingVisitOrderByWithRelationInput[]
    cursor?: BookingVisitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingVisitScalarFieldEnum | BookingVisitScalarFieldEnum[]
  }

  /**
   * User.supportTickets
   */
  export type User$supportTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    where?: SupportTicketWhereInput
    orderBy?: SupportTicketOrderByWithRelationInput | SupportTicketOrderByWithRelationInput[]
    cursor?: SupportTicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SupportTicketScalarFieldEnum | SupportTicketScalarFieldEnum[]
  }

  /**
   * User.sosAlerts
   */
  export type User$sosAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    where?: SOSAlertWhereInput
    orderBy?: SOSAlertOrderByWithRelationInput | SOSAlertOrderByWithRelationInput[]
    cursor?: SOSAlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SOSAlertScalarFieldEnum | SOSAlertScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model LocationLog
   */

  export type AggregateLocationLog = {
    _count: LocationLogCountAggregateOutputType | null
    _avg: LocationLogAvgAggregateOutputType | null
    _sum: LocationLogSumAggregateOutputType | null
    _min: LocationLogMinAggregateOutputType | null
    _max: LocationLogMaxAggregateOutputType | null
  }

  export type LocationLogAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    accuracy: number | null
    speed: number | null
    heading: number | null
    riskScore: number | null
  }

  export type LocationLogSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    accuracy: number | null
    speed: number | null
    heading: number | null
    riskScore: number | null
  }

  export type LocationLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    latitude: number | null
    longitude: number | null
    accuracy: number | null
    speed: number | null
    heading: number | null
    riskScore: number | null
    source: $Enums.LocationSource | null
    timestamp: Date | null
  }

  export type LocationLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    latitude: number | null
    longitude: number | null
    accuracy: number | null
    speed: number | null
    heading: number | null
    riskScore: number | null
    source: $Enums.LocationSource | null
    timestamp: Date | null
  }

  export type LocationLogCountAggregateOutputType = {
    id: number
    userId: number
    latitude: number
    longitude: number
    accuracy: number
    speed: number
    heading: number
    riskScore: number
    source: number
    timestamp: number
    _all: number
  }


  export type LocationLogAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    accuracy?: true
    speed?: true
    heading?: true
    riskScore?: true
  }

  export type LocationLogSumAggregateInputType = {
    latitude?: true
    longitude?: true
    accuracy?: true
    speed?: true
    heading?: true
    riskScore?: true
  }

  export type LocationLogMinAggregateInputType = {
    id?: true
    userId?: true
    latitude?: true
    longitude?: true
    accuracy?: true
    speed?: true
    heading?: true
    riskScore?: true
    source?: true
    timestamp?: true
  }

  export type LocationLogMaxAggregateInputType = {
    id?: true
    userId?: true
    latitude?: true
    longitude?: true
    accuracy?: true
    speed?: true
    heading?: true
    riskScore?: true
    source?: true
    timestamp?: true
  }

  export type LocationLogCountAggregateInputType = {
    id?: true
    userId?: true
    latitude?: true
    longitude?: true
    accuracy?: true
    speed?: true
    heading?: true
    riskScore?: true
    source?: true
    timestamp?: true
    _all?: true
  }

  export type LocationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationLog to aggregate.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocationLogs
    **/
    _count?: true | LocationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationLogMaxAggregateInputType
  }

  export type GetLocationLogAggregateType<T extends LocationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateLocationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocationLog[P]>
      : GetScalarType<T[P], AggregateLocationLog[P]>
  }




  export type LocationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationLogWhereInput
    orderBy?: LocationLogOrderByWithAggregationInput | LocationLogOrderByWithAggregationInput[]
    by: LocationLogScalarFieldEnum[] | LocationLogScalarFieldEnum
    having?: LocationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationLogCountAggregateInputType | true
    _avg?: LocationLogAvgAggregateInputType
    _sum?: LocationLogSumAggregateInputType
    _min?: LocationLogMinAggregateInputType
    _max?: LocationLogMaxAggregateInputType
  }

  export type LocationLogGroupByOutputType = {
    id: string
    userId: string
    latitude: number
    longitude: number
    accuracy: number | null
    speed: number | null
    heading: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp: Date
    _count: LocationLogCountAggregateOutputType | null
    _avg: LocationLogAvgAggregateOutputType | null
    _sum: LocationLogSumAggregateOutputType | null
    _min: LocationLogMinAggregateOutputType | null
    _max: LocationLogMaxAggregateOutputType | null
  }

  type GetLocationLogGroupByPayload<T extends LocationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationLogGroupByOutputType[P]>
            : GetScalarType<T[P], LocationLogGroupByOutputType[P]>
        }
      >
    >


  export type LocationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    speed?: boolean
    heading?: boolean
    riskScore?: boolean
    source?: boolean
    timestamp?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationLog"]>

  export type LocationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    speed?: boolean
    heading?: boolean
    riskScore?: boolean
    source?: boolean
    timestamp?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationLog"]>

  export type LocationLogSelectScalar = {
    id?: boolean
    userId?: boolean
    latitude?: boolean
    longitude?: boolean
    accuracy?: boolean
    speed?: boolean
    heading?: boolean
    riskScore?: boolean
    source?: boolean
    timestamp?: boolean
  }

  export type LocationLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LocationLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LocationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocationLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      latitude: number
      longitude: number
      accuracy: number | null
      speed: number | null
      heading: number | null
      riskScore: number
      source: $Enums.LocationSource
      timestamp: Date
    }, ExtArgs["result"]["locationLog"]>
    composites: {}
  }

  type LocationLogGetPayload<S extends boolean | null | undefined | LocationLogDefaultArgs> = $Result.GetResult<Prisma.$LocationLogPayload, S>

  type LocationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LocationLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LocationLogCountAggregateInputType | true
    }

  export interface LocationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocationLog'], meta: { name: 'LocationLog' } }
    /**
     * Find zero or one LocationLog that matches the filter.
     * @param {LocationLogFindUniqueArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationLogFindUniqueArgs>(args: SelectSubset<T, LocationLogFindUniqueArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LocationLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LocationLogFindUniqueOrThrowArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LocationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogFindFirstArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationLogFindFirstArgs>(args?: SelectSubset<T, LocationLogFindFirstArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LocationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogFindFirstOrThrowArgs} args - Arguments to find a LocationLog
     * @example
     * // Get one LocationLog
     * const locationLog = await prisma.locationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LocationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocationLogs
     * const locationLogs = await prisma.locationLog.findMany()
     * 
     * // Get first 10 LocationLogs
     * const locationLogs = await prisma.locationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationLogWithIdOnly = await prisma.locationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationLogFindManyArgs>(args?: SelectSubset<T, LocationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LocationLog.
     * @param {LocationLogCreateArgs} args - Arguments to create a LocationLog.
     * @example
     * // Create one LocationLog
     * const LocationLog = await prisma.locationLog.create({
     *   data: {
     *     // ... data to create a LocationLog
     *   }
     * })
     * 
     */
    create<T extends LocationLogCreateArgs>(args: SelectSubset<T, LocationLogCreateArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LocationLogs.
     * @param {LocationLogCreateManyArgs} args - Arguments to create many LocationLogs.
     * @example
     * // Create many LocationLogs
     * const locationLog = await prisma.locationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationLogCreateManyArgs>(args?: SelectSubset<T, LocationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocationLogs and returns the data saved in the database.
     * @param {LocationLogCreateManyAndReturnArgs} args - Arguments to create many LocationLogs.
     * @example
     * // Create many LocationLogs
     * const locationLog = await prisma.locationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocationLogs and only return the `id`
     * const locationLogWithIdOnly = await prisma.locationLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LocationLog.
     * @param {LocationLogDeleteArgs} args - Arguments to delete one LocationLog.
     * @example
     * // Delete one LocationLog
     * const LocationLog = await prisma.locationLog.delete({
     *   where: {
     *     // ... filter to delete one LocationLog
     *   }
     * })
     * 
     */
    delete<T extends LocationLogDeleteArgs>(args: SelectSubset<T, LocationLogDeleteArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LocationLog.
     * @param {LocationLogUpdateArgs} args - Arguments to update one LocationLog.
     * @example
     * // Update one LocationLog
     * const locationLog = await prisma.locationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationLogUpdateArgs>(args: SelectSubset<T, LocationLogUpdateArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LocationLogs.
     * @param {LocationLogDeleteManyArgs} args - Arguments to filter LocationLogs to delete.
     * @example
     * // Delete a few LocationLogs
     * const { count } = await prisma.locationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationLogDeleteManyArgs>(args?: SelectSubset<T, LocationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocationLogs
     * const locationLog = await prisma.locationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationLogUpdateManyArgs>(args: SelectSubset<T, LocationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LocationLog.
     * @param {LocationLogUpsertArgs} args - Arguments to update or create a LocationLog.
     * @example
     * // Update or create a LocationLog
     * const locationLog = await prisma.locationLog.upsert({
     *   create: {
     *     // ... data to create a LocationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocationLog we want to update
     *   }
     * })
     */
    upsert<T extends LocationLogUpsertArgs>(args: SelectSubset<T, LocationLogUpsertArgs<ExtArgs>>): Prisma__LocationLogClient<$Result.GetResult<Prisma.$LocationLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LocationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogCountArgs} args - Arguments to filter LocationLogs to count.
     * @example
     * // Count the number of LocationLogs
     * const count = await prisma.locationLog.count({
     *   where: {
     *     // ... the filter for the LocationLogs we want to count
     *   }
     * })
    **/
    count<T extends LocationLogCountArgs>(
      args?: Subset<T, LocationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationLogAggregateArgs>(args: Subset<T, LocationLogAggregateArgs>): Prisma.PrismaPromise<GetLocationLogAggregateType<T>>

    /**
     * Group by LocationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationLogGroupByArgs['orderBy'] }
        : { orderBy?: LocationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocationLog model
   */
  readonly fields: LocationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocationLog model
   */ 
  interface LocationLogFieldRefs {
    readonly id: FieldRef<"LocationLog", 'String'>
    readonly userId: FieldRef<"LocationLog", 'String'>
    readonly latitude: FieldRef<"LocationLog", 'Float'>
    readonly longitude: FieldRef<"LocationLog", 'Float'>
    readonly accuracy: FieldRef<"LocationLog", 'Float'>
    readonly speed: FieldRef<"LocationLog", 'Float'>
    readonly heading: FieldRef<"LocationLog", 'Float'>
    readonly riskScore: FieldRef<"LocationLog", 'Int'>
    readonly source: FieldRef<"LocationLog", 'LocationSource'>
    readonly timestamp: FieldRef<"LocationLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LocationLog findUnique
   */
  export type LocationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog findUniqueOrThrow
   */
  export type LocationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog findFirst
   */
  export type LocationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationLogs.
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationLogs.
     */
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * LocationLog findFirstOrThrow
   */
  export type LocationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLog to fetch.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationLogs.
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationLogs.
     */
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * LocationLog findMany
   */
  export type LocationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter, which LocationLogs to fetch.
     */
    where?: LocationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationLogs to fetch.
     */
    orderBy?: LocationLogOrderByWithRelationInput | LocationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocationLogs.
     */
    cursor?: LocationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationLogs.
     */
    skip?: number
    distinct?: LocationLogScalarFieldEnum | LocationLogScalarFieldEnum[]
  }

  /**
   * LocationLog create
   */
  export type LocationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * The data needed to create a LocationLog.
     */
    data: XOR<LocationLogCreateInput, LocationLogUncheckedCreateInput>
  }

  /**
   * LocationLog createMany
   */
  export type LocationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocationLogs.
     */
    data: LocationLogCreateManyInput | LocationLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LocationLog createManyAndReturn
   */
  export type LocationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LocationLogs.
     */
    data: LocationLogCreateManyInput | LocationLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocationLog update
   */
  export type LocationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * The data needed to update a LocationLog.
     */
    data: XOR<LocationLogUpdateInput, LocationLogUncheckedUpdateInput>
    /**
     * Choose, which LocationLog to update.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog updateMany
   */
  export type LocationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocationLogs.
     */
    data: XOR<LocationLogUpdateManyMutationInput, LocationLogUncheckedUpdateManyInput>
    /**
     * Filter which LocationLogs to update
     */
    where?: LocationLogWhereInput
  }

  /**
   * LocationLog upsert
   */
  export type LocationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * The filter to search for the LocationLog to update in case it exists.
     */
    where: LocationLogWhereUniqueInput
    /**
     * In case the LocationLog found by the `where` argument doesn't exist, create a new LocationLog with this data.
     */
    create: XOR<LocationLogCreateInput, LocationLogUncheckedCreateInput>
    /**
     * In case the LocationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationLogUpdateInput, LocationLogUncheckedUpdateInput>
  }

  /**
   * LocationLog delete
   */
  export type LocationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
    /**
     * Filter which LocationLog to delete.
     */
    where: LocationLogWhereUniqueInput
  }

  /**
   * LocationLog deleteMany
   */
  export type LocationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationLogs to delete
     */
    where?: LocationLogWhereInput
  }

  /**
   * LocationLog without action
   */
  export type LocationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationLog
     */
    select?: LocationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationLogInclude<ExtArgs> | null
  }


  /**
   * Model EmergencyContact
   */

  export type AggregateEmergencyContact = {
    _count: EmergencyContactCountAggregateOutputType | null
    _min: EmergencyContactMinAggregateOutputType | null
    _max: EmergencyContactMaxAggregateOutputType | null
  }

  export type EmergencyContactMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    phone: string | null
    email: string | null
    relation: string | null
  }

  export type EmergencyContactMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    phone: string | null
    email: string | null
    relation: string | null
  }

  export type EmergencyContactCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    phone: number
    email: number
    relation: number
    _all: number
  }


  export type EmergencyContactMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    phone?: true
    email?: true
    relation?: true
  }

  export type EmergencyContactMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    phone?: true
    email?: true
    relation?: true
  }

  export type EmergencyContactCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    phone?: true
    email?: true
    relation?: true
    _all?: true
  }

  export type EmergencyContactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmergencyContact to aggregate.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmergencyContacts
    **/
    _count?: true | EmergencyContactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmergencyContactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmergencyContactMaxAggregateInputType
  }

  export type GetEmergencyContactAggregateType<T extends EmergencyContactAggregateArgs> = {
        [P in keyof T & keyof AggregateEmergencyContact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmergencyContact[P]>
      : GetScalarType<T[P], AggregateEmergencyContact[P]>
  }




  export type EmergencyContactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmergencyContactWhereInput
    orderBy?: EmergencyContactOrderByWithAggregationInput | EmergencyContactOrderByWithAggregationInput[]
    by: EmergencyContactScalarFieldEnum[] | EmergencyContactScalarFieldEnum
    having?: EmergencyContactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmergencyContactCountAggregateInputType | true
    _min?: EmergencyContactMinAggregateInputType
    _max?: EmergencyContactMaxAggregateInputType
  }

  export type EmergencyContactGroupByOutputType = {
    id: string
    userId: string
    name: string
    phone: string
    email: string | null
    relation: string
    _count: EmergencyContactCountAggregateOutputType | null
    _min: EmergencyContactMinAggregateOutputType | null
    _max: EmergencyContactMaxAggregateOutputType | null
  }

  type GetEmergencyContactGroupByPayload<T extends EmergencyContactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmergencyContactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmergencyContactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmergencyContactGroupByOutputType[P]>
            : GetScalarType<T[P], EmergencyContactGroupByOutputType[P]>
        }
      >
    >


  export type EmergencyContactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    relation?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emergencyContact"]>

  export type EmergencyContactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    relation?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emergencyContact"]>

  export type EmergencyContactSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    relation?: boolean
  }

  export type EmergencyContactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EmergencyContactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EmergencyContactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmergencyContact"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      phone: string
      email: string | null
      relation: string
    }, ExtArgs["result"]["emergencyContact"]>
    composites: {}
  }

  type EmergencyContactGetPayload<S extends boolean | null | undefined | EmergencyContactDefaultArgs> = $Result.GetResult<Prisma.$EmergencyContactPayload, S>

  type EmergencyContactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmergencyContactFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmergencyContactCountAggregateInputType | true
    }

  export interface EmergencyContactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmergencyContact'], meta: { name: 'EmergencyContact' } }
    /**
     * Find zero or one EmergencyContact that matches the filter.
     * @param {EmergencyContactFindUniqueArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmergencyContactFindUniqueArgs>(args: SelectSubset<T, EmergencyContactFindUniqueArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EmergencyContact that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmergencyContactFindUniqueOrThrowArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmergencyContactFindUniqueOrThrowArgs>(args: SelectSubset<T, EmergencyContactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EmergencyContact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactFindFirstArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmergencyContactFindFirstArgs>(args?: SelectSubset<T, EmergencyContactFindFirstArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EmergencyContact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactFindFirstOrThrowArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmergencyContactFindFirstOrThrowArgs>(args?: SelectSubset<T, EmergencyContactFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EmergencyContacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmergencyContacts
     * const emergencyContacts = await prisma.emergencyContact.findMany()
     * 
     * // Get first 10 EmergencyContacts
     * const emergencyContacts = await prisma.emergencyContact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emergencyContactWithIdOnly = await prisma.emergencyContact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmergencyContactFindManyArgs>(args?: SelectSubset<T, EmergencyContactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EmergencyContact.
     * @param {EmergencyContactCreateArgs} args - Arguments to create a EmergencyContact.
     * @example
     * // Create one EmergencyContact
     * const EmergencyContact = await prisma.emergencyContact.create({
     *   data: {
     *     // ... data to create a EmergencyContact
     *   }
     * })
     * 
     */
    create<T extends EmergencyContactCreateArgs>(args: SelectSubset<T, EmergencyContactCreateArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EmergencyContacts.
     * @param {EmergencyContactCreateManyArgs} args - Arguments to create many EmergencyContacts.
     * @example
     * // Create many EmergencyContacts
     * const emergencyContact = await prisma.emergencyContact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmergencyContactCreateManyArgs>(args?: SelectSubset<T, EmergencyContactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmergencyContacts and returns the data saved in the database.
     * @param {EmergencyContactCreateManyAndReturnArgs} args - Arguments to create many EmergencyContacts.
     * @example
     * // Create many EmergencyContacts
     * const emergencyContact = await prisma.emergencyContact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmergencyContacts and only return the `id`
     * const emergencyContactWithIdOnly = await prisma.emergencyContact.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmergencyContactCreateManyAndReturnArgs>(args?: SelectSubset<T, EmergencyContactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EmergencyContact.
     * @param {EmergencyContactDeleteArgs} args - Arguments to delete one EmergencyContact.
     * @example
     * // Delete one EmergencyContact
     * const EmergencyContact = await prisma.emergencyContact.delete({
     *   where: {
     *     // ... filter to delete one EmergencyContact
     *   }
     * })
     * 
     */
    delete<T extends EmergencyContactDeleteArgs>(args: SelectSubset<T, EmergencyContactDeleteArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EmergencyContact.
     * @param {EmergencyContactUpdateArgs} args - Arguments to update one EmergencyContact.
     * @example
     * // Update one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmergencyContactUpdateArgs>(args: SelectSubset<T, EmergencyContactUpdateArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EmergencyContacts.
     * @param {EmergencyContactDeleteManyArgs} args - Arguments to filter EmergencyContacts to delete.
     * @example
     * // Delete a few EmergencyContacts
     * const { count } = await prisma.emergencyContact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmergencyContactDeleteManyArgs>(args?: SelectSubset<T, EmergencyContactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmergencyContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmergencyContacts
     * const emergencyContact = await prisma.emergencyContact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmergencyContactUpdateManyArgs>(args: SelectSubset<T, EmergencyContactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmergencyContact.
     * @param {EmergencyContactUpsertArgs} args - Arguments to update or create a EmergencyContact.
     * @example
     * // Update or create a EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.upsert({
     *   create: {
     *     // ... data to create a EmergencyContact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmergencyContact we want to update
     *   }
     * })
     */
    upsert<T extends EmergencyContactUpsertArgs>(args: SelectSubset<T, EmergencyContactUpsertArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EmergencyContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactCountArgs} args - Arguments to filter EmergencyContacts to count.
     * @example
     * // Count the number of EmergencyContacts
     * const count = await prisma.emergencyContact.count({
     *   where: {
     *     // ... the filter for the EmergencyContacts we want to count
     *   }
     * })
    **/
    count<T extends EmergencyContactCountArgs>(
      args?: Subset<T, EmergencyContactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmergencyContactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmergencyContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmergencyContactAggregateArgs>(args: Subset<T, EmergencyContactAggregateArgs>): Prisma.PrismaPromise<GetEmergencyContactAggregateType<T>>

    /**
     * Group by EmergencyContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmergencyContactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmergencyContactGroupByArgs['orderBy'] }
        : { orderBy?: EmergencyContactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmergencyContactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmergencyContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmergencyContact model
   */
  readonly fields: EmergencyContactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmergencyContact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmergencyContactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmergencyContact model
   */ 
  interface EmergencyContactFieldRefs {
    readonly id: FieldRef<"EmergencyContact", 'String'>
    readonly userId: FieldRef<"EmergencyContact", 'String'>
    readonly name: FieldRef<"EmergencyContact", 'String'>
    readonly phone: FieldRef<"EmergencyContact", 'String'>
    readonly email: FieldRef<"EmergencyContact", 'String'>
    readonly relation: FieldRef<"EmergencyContact", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EmergencyContact findUnique
   */
  export type EmergencyContactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact findUniqueOrThrow
   */
  export type EmergencyContactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact findFirst
   */
  export type EmergencyContactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmergencyContacts.
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmergencyContacts.
     */
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * EmergencyContact findFirstOrThrow
   */
  export type EmergencyContactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmergencyContacts.
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmergencyContacts.
     */
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * EmergencyContact findMany
   */
  export type EmergencyContactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContacts to fetch.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmergencyContacts.
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * EmergencyContact create
   */
  export type EmergencyContactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * The data needed to create a EmergencyContact.
     */
    data: XOR<EmergencyContactCreateInput, EmergencyContactUncheckedCreateInput>
  }

  /**
   * EmergencyContact createMany
   */
  export type EmergencyContactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmergencyContacts.
     */
    data: EmergencyContactCreateManyInput | EmergencyContactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmergencyContact createManyAndReturn
   */
  export type EmergencyContactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EmergencyContacts.
     */
    data: EmergencyContactCreateManyInput | EmergencyContactCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmergencyContact update
   */
  export type EmergencyContactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * The data needed to update a EmergencyContact.
     */
    data: XOR<EmergencyContactUpdateInput, EmergencyContactUncheckedUpdateInput>
    /**
     * Choose, which EmergencyContact to update.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact updateMany
   */
  export type EmergencyContactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmergencyContacts.
     */
    data: XOR<EmergencyContactUpdateManyMutationInput, EmergencyContactUncheckedUpdateManyInput>
    /**
     * Filter which EmergencyContacts to update
     */
    where?: EmergencyContactWhereInput
  }

  /**
   * EmergencyContact upsert
   */
  export type EmergencyContactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * The filter to search for the EmergencyContact to update in case it exists.
     */
    where: EmergencyContactWhereUniqueInput
    /**
     * In case the EmergencyContact found by the `where` argument doesn't exist, create a new EmergencyContact with this data.
     */
    create: XOR<EmergencyContactCreateInput, EmergencyContactUncheckedCreateInput>
    /**
     * In case the EmergencyContact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmergencyContactUpdateInput, EmergencyContactUncheckedUpdateInput>
  }

  /**
   * EmergencyContact delete
   */
  export type EmergencyContactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter which EmergencyContact to delete.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact deleteMany
   */
  export type EmergencyContactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmergencyContacts to delete
     */
    where?: EmergencyContactWhereInput
  }

  /**
   * EmergencyContact without action
   */
  export type EmergencyContactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
  }


  /**
   * Model Itinerary
   */

  export type AggregateItinerary = {
    _count: ItineraryCountAggregateOutputType | null
    _min: ItineraryMinAggregateOutputType | null
    _max: ItineraryMaxAggregateOutputType | null
  }

  export type ItineraryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    startLocation: string | null
    endLocation: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.ItineraryStatus | null
  }

  export type ItineraryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    startLocation: string | null
    endLocation: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.ItineraryStatus | null
  }

  export type ItineraryCountAggregateOutputType = {
    id: number
    userId: number
    startLocation: number
    endLocation: number
    startTime: number
    endTime: number
    status: number
    checklist: number
    _all: number
  }


  export type ItineraryMinAggregateInputType = {
    id?: true
    userId?: true
    startLocation?: true
    endLocation?: true
    startTime?: true
    endTime?: true
    status?: true
  }

  export type ItineraryMaxAggregateInputType = {
    id?: true
    userId?: true
    startLocation?: true
    endLocation?: true
    startTime?: true
    endTime?: true
    status?: true
  }

  export type ItineraryCountAggregateInputType = {
    id?: true
    userId?: true
    startLocation?: true
    endLocation?: true
    startTime?: true
    endTime?: true
    status?: true
    checklist?: true
    _all?: true
  }

  export type ItineraryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Itinerary to aggregate.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Itineraries
    **/
    _count?: true | ItineraryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItineraryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItineraryMaxAggregateInputType
  }

  export type GetItineraryAggregateType<T extends ItineraryAggregateArgs> = {
        [P in keyof T & keyof AggregateItinerary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItinerary[P]>
      : GetScalarType<T[P], AggregateItinerary[P]>
  }




  export type ItineraryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItineraryWhereInput
    orderBy?: ItineraryOrderByWithAggregationInput | ItineraryOrderByWithAggregationInput[]
    by: ItineraryScalarFieldEnum[] | ItineraryScalarFieldEnum
    having?: ItineraryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItineraryCountAggregateInputType | true
    _min?: ItineraryMinAggregateInputType
    _max?: ItineraryMaxAggregateInputType
  }

  export type ItineraryGroupByOutputType = {
    id: string
    userId: string
    startLocation: string
    endLocation: string
    startTime: Date
    endTime: Date
    status: $Enums.ItineraryStatus
    checklist: JsonValue | null
    _count: ItineraryCountAggregateOutputType | null
    _min: ItineraryMinAggregateOutputType | null
    _max: ItineraryMaxAggregateOutputType | null
  }

  type GetItineraryGroupByPayload<T extends ItineraryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItineraryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItineraryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItineraryGroupByOutputType[P]>
            : GetScalarType<T[P], ItineraryGroupByOutputType[P]>
        }
      >
    >


  export type ItinerarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    startLocation?: boolean
    endLocation?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    checklist?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itinerary"]>

  export type ItinerarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    startLocation?: boolean
    endLocation?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    checklist?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itinerary"]>

  export type ItinerarySelectScalar = {
    id?: boolean
    userId?: boolean
    startLocation?: boolean
    endLocation?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    checklist?: boolean
  }

  export type ItineraryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ItineraryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ItineraryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Itinerary"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      startLocation: string
      endLocation: string
      startTime: Date
      endTime: Date
      status: $Enums.ItineraryStatus
      checklist: Prisma.JsonValue | null
    }, ExtArgs["result"]["itinerary"]>
    composites: {}
  }

  type ItineraryGetPayload<S extends boolean | null | undefined | ItineraryDefaultArgs> = $Result.GetResult<Prisma.$ItineraryPayload, S>

  type ItineraryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ItineraryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ItineraryCountAggregateInputType | true
    }

  export interface ItineraryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Itinerary'], meta: { name: 'Itinerary' } }
    /**
     * Find zero or one Itinerary that matches the filter.
     * @param {ItineraryFindUniqueArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItineraryFindUniqueArgs>(args: SelectSubset<T, ItineraryFindUniqueArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Itinerary that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ItineraryFindUniqueOrThrowArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItineraryFindUniqueOrThrowArgs>(args: SelectSubset<T, ItineraryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Itinerary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryFindFirstArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItineraryFindFirstArgs>(args?: SelectSubset<T, ItineraryFindFirstArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Itinerary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryFindFirstOrThrowArgs} args - Arguments to find a Itinerary
     * @example
     * // Get one Itinerary
     * const itinerary = await prisma.itinerary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItineraryFindFirstOrThrowArgs>(args?: SelectSubset<T, ItineraryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Itineraries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Itineraries
     * const itineraries = await prisma.itinerary.findMany()
     * 
     * // Get first 10 Itineraries
     * const itineraries = await prisma.itinerary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itineraryWithIdOnly = await prisma.itinerary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItineraryFindManyArgs>(args?: SelectSubset<T, ItineraryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Itinerary.
     * @param {ItineraryCreateArgs} args - Arguments to create a Itinerary.
     * @example
     * // Create one Itinerary
     * const Itinerary = await prisma.itinerary.create({
     *   data: {
     *     // ... data to create a Itinerary
     *   }
     * })
     * 
     */
    create<T extends ItineraryCreateArgs>(args: SelectSubset<T, ItineraryCreateArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Itineraries.
     * @param {ItineraryCreateManyArgs} args - Arguments to create many Itineraries.
     * @example
     * // Create many Itineraries
     * const itinerary = await prisma.itinerary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItineraryCreateManyArgs>(args?: SelectSubset<T, ItineraryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Itineraries and returns the data saved in the database.
     * @param {ItineraryCreateManyAndReturnArgs} args - Arguments to create many Itineraries.
     * @example
     * // Create many Itineraries
     * const itinerary = await prisma.itinerary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Itineraries and only return the `id`
     * const itineraryWithIdOnly = await prisma.itinerary.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItineraryCreateManyAndReturnArgs>(args?: SelectSubset<T, ItineraryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Itinerary.
     * @param {ItineraryDeleteArgs} args - Arguments to delete one Itinerary.
     * @example
     * // Delete one Itinerary
     * const Itinerary = await prisma.itinerary.delete({
     *   where: {
     *     // ... filter to delete one Itinerary
     *   }
     * })
     * 
     */
    delete<T extends ItineraryDeleteArgs>(args: SelectSubset<T, ItineraryDeleteArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Itinerary.
     * @param {ItineraryUpdateArgs} args - Arguments to update one Itinerary.
     * @example
     * // Update one Itinerary
     * const itinerary = await prisma.itinerary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItineraryUpdateArgs>(args: SelectSubset<T, ItineraryUpdateArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Itineraries.
     * @param {ItineraryDeleteManyArgs} args - Arguments to filter Itineraries to delete.
     * @example
     * // Delete a few Itineraries
     * const { count } = await prisma.itinerary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItineraryDeleteManyArgs>(args?: SelectSubset<T, ItineraryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Itineraries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Itineraries
     * const itinerary = await prisma.itinerary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItineraryUpdateManyArgs>(args: SelectSubset<T, ItineraryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Itinerary.
     * @param {ItineraryUpsertArgs} args - Arguments to update or create a Itinerary.
     * @example
     * // Update or create a Itinerary
     * const itinerary = await prisma.itinerary.upsert({
     *   create: {
     *     // ... data to create a Itinerary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Itinerary we want to update
     *   }
     * })
     */
    upsert<T extends ItineraryUpsertArgs>(args: SelectSubset<T, ItineraryUpsertArgs<ExtArgs>>): Prisma__ItineraryClient<$Result.GetResult<Prisma.$ItineraryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Itineraries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryCountArgs} args - Arguments to filter Itineraries to count.
     * @example
     * // Count the number of Itineraries
     * const count = await prisma.itinerary.count({
     *   where: {
     *     // ... the filter for the Itineraries we want to count
     *   }
     * })
    **/
    count<T extends ItineraryCountArgs>(
      args?: Subset<T, ItineraryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItineraryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Itinerary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItineraryAggregateArgs>(args: Subset<T, ItineraryAggregateArgs>): Prisma.PrismaPromise<GetItineraryAggregateType<T>>

    /**
     * Group by Itinerary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItineraryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItineraryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItineraryGroupByArgs['orderBy'] }
        : { orderBy?: ItineraryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItineraryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItineraryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Itinerary model
   */
  readonly fields: ItineraryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Itinerary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItineraryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Itinerary model
   */ 
  interface ItineraryFieldRefs {
    readonly id: FieldRef<"Itinerary", 'String'>
    readonly userId: FieldRef<"Itinerary", 'String'>
    readonly startLocation: FieldRef<"Itinerary", 'String'>
    readonly endLocation: FieldRef<"Itinerary", 'String'>
    readonly startTime: FieldRef<"Itinerary", 'DateTime'>
    readonly endTime: FieldRef<"Itinerary", 'DateTime'>
    readonly status: FieldRef<"Itinerary", 'ItineraryStatus'>
    readonly checklist: FieldRef<"Itinerary", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Itinerary findUnique
   */
  export type ItineraryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary findUniqueOrThrow
   */
  export type ItineraryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary findFirst
   */
  export type ItineraryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Itineraries.
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Itineraries.
     */
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * Itinerary findFirstOrThrow
   */
  export type ItineraryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itinerary to fetch.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Itineraries.
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Itineraries.
     */
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * Itinerary findMany
   */
  export type ItineraryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter, which Itineraries to fetch.
     */
    where?: ItineraryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Itineraries to fetch.
     */
    orderBy?: ItineraryOrderByWithRelationInput | ItineraryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Itineraries.
     */
    cursor?: ItineraryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Itineraries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Itineraries.
     */
    skip?: number
    distinct?: ItineraryScalarFieldEnum | ItineraryScalarFieldEnum[]
  }

  /**
   * Itinerary create
   */
  export type ItineraryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * The data needed to create a Itinerary.
     */
    data: XOR<ItineraryCreateInput, ItineraryUncheckedCreateInput>
  }

  /**
   * Itinerary createMany
   */
  export type ItineraryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Itineraries.
     */
    data: ItineraryCreateManyInput | ItineraryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Itinerary createManyAndReturn
   */
  export type ItineraryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Itineraries.
     */
    data: ItineraryCreateManyInput | ItineraryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Itinerary update
   */
  export type ItineraryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * The data needed to update a Itinerary.
     */
    data: XOR<ItineraryUpdateInput, ItineraryUncheckedUpdateInput>
    /**
     * Choose, which Itinerary to update.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary updateMany
   */
  export type ItineraryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Itineraries.
     */
    data: XOR<ItineraryUpdateManyMutationInput, ItineraryUncheckedUpdateManyInput>
    /**
     * Filter which Itineraries to update
     */
    where?: ItineraryWhereInput
  }

  /**
   * Itinerary upsert
   */
  export type ItineraryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * The filter to search for the Itinerary to update in case it exists.
     */
    where: ItineraryWhereUniqueInput
    /**
     * In case the Itinerary found by the `where` argument doesn't exist, create a new Itinerary with this data.
     */
    create: XOR<ItineraryCreateInput, ItineraryUncheckedCreateInput>
    /**
     * In case the Itinerary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItineraryUpdateInput, ItineraryUncheckedUpdateInput>
  }

  /**
   * Itinerary delete
   */
  export type ItineraryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
    /**
     * Filter which Itinerary to delete.
     */
    where: ItineraryWhereUniqueInput
  }

  /**
   * Itinerary deleteMany
   */
  export type ItineraryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Itineraries to delete
     */
    where?: ItineraryWhereInput
  }

  /**
   * Itinerary without action
   */
  export type ItineraryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Itinerary
     */
    select?: ItinerarySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItineraryInclude<ExtArgs> | null
  }


  /**
   * Model BookingPartner
   */

  export type AggregateBookingPartner = {
    _count: BookingPartnerCountAggregateOutputType | null
    _avg: BookingPartnerAvgAggregateOutputType | null
    _sum: BookingPartnerSumAggregateOutputType | null
    _min: BookingPartnerMinAggregateOutputType | null
    _max: BookingPartnerMaxAggregateOutputType | null
  }

  export type BookingPartnerAvgAggregateOutputType = {
    priority: number | null
  }

  export type BookingPartnerSumAggregateOutputType = {
    priority: number | null
  }

  export type BookingPartnerMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    url: string | null
    logoUrl: string | null
    category: string | null
    isVerified: boolean | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingPartnerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    url: string | null
    logoUrl: string | null
    category: string | null
    isVerified: boolean | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingPartnerCountAggregateOutputType = {
    id: number
    name: number
    description: number
    url: number
    logoUrl: number
    category: number
    isVerified: number
    isActive: number
    priority: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookingPartnerAvgAggregateInputType = {
    priority?: true
  }

  export type BookingPartnerSumAggregateInputType = {
    priority?: true
  }

  export type BookingPartnerMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    url?: true
    logoUrl?: true
    category?: true
    isVerified?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingPartnerMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    url?: true
    logoUrl?: true
    category?: true
    isVerified?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingPartnerCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    url?: true
    logoUrl?: true
    category?: true
    isVerified?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookingPartnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingPartner to aggregate.
     */
    where?: BookingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingPartners to fetch.
     */
    orderBy?: BookingPartnerOrderByWithRelationInput | BookingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingPartners
    **/
    _count?: true | BookingPartnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingPartnerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingPartnerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingPartnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingPartnerMaxAggregateInputType
  }

  export type GetBookingPartnerAggregateType<T extends BookingPartnerAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingPartner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingPartner[P]>
      : GetScalarType<T[P], AggregateBookingPartner[P]>
  }




  export type BookingPartnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingPartnerWhereInput
    orderBy?: BookingPartnerOrderByWithAggregationInput | BookingPartnerOrderByWithAggregationInput[]
    by: BookingPartnerScalarFieldEnum[] | BookingPartnerScalarFieldEnum
    having?: BookingPartnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingPartnerCountAggregateInputType | true
    _avg?: BookingPartnerAvgAggregateInputType
    _sum?: BookingPartnerSumAggregateInputType
    _min?: BookingPartnerMinAggregateInputType
    _max?: BookingPartnerMaxAggregateInputType
  }

  export type BookingPartnerGroupByOutputType = {
    id: string
    name: string
    description: string
    url: string
    logoUrl: string | null
    category: string
    isVerified: boolean
    isActive: boolean
    priority: number
    createdAt: Date
    updatedAt: Date
    _count: BookingPartnerCountAggregateOutputType | null
    _avg: BookingPartnerAvgAggregateOutputType | null
    _sum: BookingPartnerSumAggregateOutputType | null
    _min: BookingPartnerMinAggregateOutputType | null
    _max: BookingPartnerMaxAggregateOutputType | null
  }

  type GetBookingPartnerGroupByPayload<T extends BookingPartnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingPartnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingPartnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingPartnerGroupByOutputType[P]>
            : GetScalarType<T[P], BookingPartnerGroupByOutputType[P]>
        }
      >
    >


  export type BookingPartnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    logoUrl?: boolean
    category?: boolean
    isVerified?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    visits?: boolean | BookingPartner$visitsArgs<ExtArgs>
    _count?: boolean | BookingPartnerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingPartner"]>

  export type BookingPartnerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    logoUrl?: boolean
    category?: boolean
    isVerified?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bookingPartner"]>

  export type BookingPartnerSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    url?: boolean
    logoUrl?: boolean
    category?: boolean
    isVerified?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookingPartnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    visits?: boolean | BookingPartner$visitsArgs<ExtArgs>
    _count?: boolean | BookingPartnerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BookingPartnerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BookingPartnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingPartner"
    objects: {
      visits: Prisma.$BookingVisitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      url: string
      logoUrl: string | null
      category: string
      isVerified: boolean
      isActive: boolean
      priority: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bookingPartner"]>
    composites: {}
  }

  type BookingPartnerGetPayload<S extends boolean | null | undefined | BookingPartnerDefaultArgs> = $Result.GetResult<Prisma.$BookingPartnerPayload, S>

  type BookingPartnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookingPartnerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookingPartnerCountAggregateInputType | true
    }

  export interface BookingPartnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingPartner'], meta: { name: 'BookingPartner' } }
    /**
     * Find zero or one BookingPartner that matches the filter.
     * @param {BookingPartnerFindUniqueArgs} args - Arguments to find a BookingPartner
     * @example
     * // Get one BookingPartner
     * const bookingPartner = await prisma.bookingPartner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingPartnerFindUniqueArgs>(args: SelectSubset<T, BookingPartnerFindUniqueArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BookingPartner that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookingPartnerFindUniqueOrThrowArgs} args - Arguments to find a BookingPartner
     * @example
     * // Get one BookingPartner
     * const bookingPartner = await prisma.bookingPartner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingPartnerFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingPartnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BookingPartner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerFindFirstArgs} args - Arguments to find a BookingPartner
     * @example
     * // Get one BookingPartner
     * const bookingPartner = await prisma.bookingPartner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingPartnerFindFirstArgs>(args?: SelectSubset<T, BookingPartnerFindFirstArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BookingPartner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerFindFirstOrThrowArgs} args - Arguments to find a BookingPartner
     * @example
     * // Get one BookingPartner
     * const bookingPartner = await prisma.bookingPartner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingPartnerFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingPartnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BookingPartners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingPartners
     * const bookingPartners = await prisma.bookingPartner.findMany()
     * 
     * // Get first 10 BookingPartners
     * const bookingPartners = await prisma.bookingPartner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingPartnerWithIdOnly = await prisma.bookingPartner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingPartnerFindManyArgs>(args?: SelectSubset<T, BookingPartnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BookingPartner.
     * @param {BookingPartnerCreateArgs} args - Arguments to create a BookingPartner.
     * @example
     * // Create one BookingPartner
     * const BookingPartner = await prisma.bookingPartner.create({
     *   data: {
     *     // ... data to create a BookingPartner
     *   }
     * })
     * 
     */
    create<T extends BookingPartnerCreateArgs>(args: SelectSubset<T, BookingPartnerCreateArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BookingPartners.
     * @param {BookingPartnerCreateManyArgs} args - Arguments to create many BookingPartners.
     * @example
     * // Create many BookingPartners
     * const bookingPartner = await prisma.bookingPartner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingPartnerCreateManyArgs>(args?: SelectSubset<T, BookingPartnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingPartners and returns the data saved in the database.
     * @param {BookingPartnerCreateManyAndReturnArgs} args - Arguments to create many BookingPartners.
     * @example
     * // Create many BookingPartners
     * const bookingPartner = await prisma.bookingPartner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingPartners and only return the `id`
     * const bookingPartnerWithIdOnly = await prisma.bookingPartner.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingPartnerCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingPartnerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BookingPartner.
     * @param {BookingPartnerDeleteArgs} args - Arguments to delete one BookingPartner.
     * @example
     * // Delete one BookingPartner
     * const BookingPartner = await prisma.bookingPartner.delete({
     *   where: {
     *     // ... filter to delete one BookingPartner
     *   }
     * })
     * 
     */
    delete<T extends BookingPartnerDeleteArgs>(args: SelectSubset<T, BookingPartnerDeleteArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BookingPartner.
     * @param {BookingPartnerUpdateArgs} args - Arguments to update one BookingPartner.
     * @example
     * // Update one BookingPartner
     * const bookingPartner = await prisma.bookingPartner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingPartnerUpdateArgs>(args: SelectSubset<T, BookingPartnerUpdateArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BookingPartners.
     * @param {BookingPartnerDeleteManyArgs} args - Arguments to filter BookingPartners to delete.
     * @example
     * // Delete a few BookingPartners
     * const { count } = await prisma.bookingPartner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingPartnerDeleteManyArgs>(args?: SelectSubset<T, BookingPartnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingPartners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingPartners
     * const bookingPartner = await prisma.bookingPartner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingPartnerUpdateManyArgs>(args: SelectSubset<T, BookingPartnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BookingPartner.
     * @param {BookingPartnerUpsertArgs} args - Arguments to update or create a BookingPartner.
     * @example
     * // Update or create a BookingPartner
     * const bookingPartner = await prisma.bookingPartner.upsert({
     *   create: {
     *     // ... data to create a BookingPartner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingPartner we want to update
     *   }
     * })
     */
    upsert<T extends BookingPartnerUpsertArgs>(args: SelectSubset<T, BookingPartnerUpsertArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BookingPartners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerCountArgs} args - Arguments to filter BookingPartners to count.
     * @example
     * // Count the number of BookingPartners
     * const count = await prisma.bookingPartner.count({
     *   where: {
     *     // ... the filter for the BookingPartners we want to count
     *   }
     * })
    **/
    count<T extends BookingPartnerCountArgs>(
      args?: Subset<T, BookingPartnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingPartnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingPartner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingPartnerAggregateArgs>(args: Subset<T, BookingPartnerAggregateArgs>): Prisma.PrismaPromise<GetBookingPartnerAggregateType<T>>

    /**
     * Group by BookingPartner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingPartnerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingPartnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingPartnerGroupByArgs['orderBy'] }
        : { orderBy?: BookingPartnerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingPartnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingPartnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingPartner model
   */
  readonly fields: BookingPartnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingPartner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingPartnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    visits<T extends BookingPartner$visitsArgs<ExtArgs> = {}>(args?: Subset<T, BookingPartner$visitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingPartner model
   */ 
  interface BookingPartnerFieldRefs {
    readonly id: FieldRef<"BookingPartner", 'String'>
    readonly name: FieldRef<"BookingPartner", 'String'>
    readonly description: FieldRef<"BookingPartner", 'String'>
    readonly url: FieldRef<"BookingPartner", 'String'>
    readonly logoUrl: FieldRef<"BookingPartner", 'String'>
    readonly category: FieldRef<"BookingPartner", 'String'>
    readonly isVerified: FieldRef<"BookingPartner", 'Boolean'>
    readonly isActive: FieldRef<"BookingPartner", 'Boolean'>
    readonly priority: FieldRef<"BookingPartner", 'Int'>
    readonly createdAt: FieldRef<"BookingPartner", 'DateTime'>
    readonly updatedAt: FieldRef<"BookingPartner", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookingPartner findUnique
   */
  export type BookingPartnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which BookingPartner to fetch.
     */
    where: BookingPartnerWhereUniqueInput
  }

  /**
   * BookingPartner findUniqueOrThrow
   */
  export type BookingPartnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which BookingPartner to fetch.
     */
    where: BookingPartnerWhereUniqueInput
  }

  /**
   * BookingPartner findFirst
   */
  export type BookingPartnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which BookingPartner to fetch.
     */
    where?: BookingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingPartners to fetch.
     */
    orderBy?: BookingPartnerOrderByWithRelationInput | BookingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingPartners.
     */
    cursor?: BookingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingPartners.
     */
    distinct?: BookingPartnerScalarFieldEnum | BookingPartnerScalarFieldEnum[]
  }

  /**
   * BookingPartner findFirstOrThrow
   */
  export type BookingPartnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which BookingPartner to fetch.
     */
    where?: BookingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingPartners to fetch.
     */
    orderBy?: BookingPartnerOrderByWithRelationInput | BookingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingPartners.
     */
    cursor?: BookingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingPartners.
     */
    distinct?: BookingPartnerScalarFieldEnum | BookingPartnerScalarFieldEnum[]
  }

  /**
   * BookingPartner findMany
   */
  export type BookingPartnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which BookingPartners to fetch.
     */
    where?: BookingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingPartners to fetch.
     */
    orderBy?: BookingPartnerOrderByWithRelationInput | BookingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingPartners.
     */
    cursor?: BookingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingPartners.
     */
    skip?: number
    distinct?: BookingPartnerScalarFieldEnum | BookingPartnerScalarFieldEnum[]
  }

  /**
   * BookingPartner create
   */
  export type BookingPartnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingPartner.
     */
    data: XOR<BookingPartnerCreateInput, BookingPartnerUncheckedCreateInput>
  }

  /**
   * BookingPartner createMany
   */
  export type BookingPartnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingPartners.
     */
    data: BookingPartnerCreateManyInput | BookingPartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingPartner createManyAndReturn
   */
  export type BookingPartnerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BookingPartners.
     */
    data: BookingPartnerCreateManyInput | BookingPartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingPartner update
   */
  export type BookingPartnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingPartner.
     */
    data: XOR<BookingPartnerUpdateInput, BookingPartnerUncheckedUpdateInput>
    /**
     * Choose, which BookingPartner to update.
     */
    where: BookingPartnerWhereUniqueInput
  }

  /**
   * BookingPartner updateMany
   */
  export type BookingPartnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingPartners.
     */
    data: XOR<BookingPartnerUpdateManyMutationInput, BookingPartnerUncheckedUpdateManyInput>
    /**
     * Filter which BookingPartners to update
     */
    where?: BookingPartnerWhereInput
  }

  /**
   * BookingPartner upsert
   */
  export type BookingPartnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingPartner to update in case it exists.
     */
    where: BookingPartnerWhereUniqueInput
    /**
     * In case the BookingPartner found by the `where` argument doesn't exist, create a new BookingPartner with this data.
     */
    create: XOR<BookingPartnerCreateInput, BookingPartnerUncheckedCreateInput>
    /**
     * In case the BookingPartner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingPartnerUpdateInput, BookingPartnerUncheckedUpdateInput>
  }

  /**
   * BookingPartner delete
   */
  export type BookingPartnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
    /**
     * Filter which BookingPartner to delete.
     */
    where: BookingPartnerWhereUniqueInput
  }

  /**
   * BookingPartner deleteMany
   */
  export type BookingPartnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingPartners to delete
     */
    where?: BookingPartnerWhereInput
  }

  /**
   * BookingPartner.visits
   */
  export type BookingPartner$visitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    where?: BookingVisitWhereInput
    orderBy?: BookingVisitOrderByWithRelationInput | BookingVisitOrderByWithRelationInput[]
    cursor?: BookingVisitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingVisitScalarFieldEnum | BookingVisitScalarFieldEnum[]
  }

  /**
   * BookingPartner without action
   */
  export type BookingPartnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingPartner
     */
    select?: BookingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingPartnerInclude<ExtArgs> | null
  }


  /**
   * Model BookingVisit
   */

  export type AggregateBookingVisit = {
    _count: BookingVisitCountAggregateOutputType | null
    _avg: BookingVisitAvgAggregateOutputType | null
    _sum: BookingVisitSumAggregateOutputType | null
    _min: BookingVisitMinAggregateOutputType | null
    _max: BookingVisitMaxAggregateOutputType | null
  }

  export type BookingVisitAvgAggregateOutputType = {
    durationMs: number | null
  }

  export type BookingVisitSumAggregateOutputType = {
    durationMs: number | null
  }

  export type BookingVisitMinAggregateOutputType = {
    id: string | null
    userId: string | null
    partnerId: string | null
    durationMs: number | null
    visitedAt: Date | null
  }

  export type BookingVisitMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    partnerId: string | null
    durationMs: number | null
    visitedAt: Date | null
  }

  export type BookingVisitCountAggregateOutputType = {
    id: number
    userId: number
    partnerId: number
    durationMs: number
    visitedAt: number
    _all: number
  }


  export type BookingVisitAvgAggregateInputType = {
    durationMs?: true
  }

  export type BookingVisitSumAggregateInputType = {
    durationMs?: true
  }

  export type BookingVisitMinAggregateInputType = {
    id?: true
    userId?: true
    partnerId?: true
    durationMs?: true
    visitedAt?: true
  }

  export type BookingVisitMaxAggregateInputType = {
    id?: true
    userId?: true
    partnerId?: true
    durationMs?: true
    visitedAt?: true
  }

  export type BookingVisitCountAggregateInputType = {
    id?: true
    userId?: true
    partnerId?: true
    durationMs?: true
    visitedAt?: true
    _all?: true
  }

  export type BookingVisitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingVisit to aggregate.
     */
    where?: BookingVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingVisits to fetch.
     */
    orderBy?: BookingVisitOrderByWithRelationInput | BookingVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingVisits
    **/
    _count?: true | BookingVisitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingVisitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingVisitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingVisitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingVisitMaxAggregateInputType
  }

  export type GetBookingVisitAggregateType<T extends BookingVisitAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingVisit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingVisit[P]>
      : GetScalarType<T[P], AggregateBookingVisit[P]>
  }




  export type BookingVisitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingVisitWhereInput
    orderBy?: BookingVisitOrderByWithAggregationInput | BookingVisitOrderByWithAggregationInput[]
    by: BookingVisitScalarFieldEnum[] | BookingVisitScalarFieldEnum
    having?: BookingVisitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingVisitCountAggregateInputType | true
    _avg?: BookingVisitAvgAggregateInputType
    _sum?: BookingVisitSumAggregateInputType
    _min?: BookingVisitMinAggregateInputType
    _max?: BookingVisitMaxAggregateInputType
  }

  export type BookingVisitGroupByOutputType = {
    id: string
    userId: string
    partnerId: string
    durationMs: number
    visitedAt: Date
    _count: BookingVisitCountAggregateOutputType | null
    _avg: BookingVisitAvgAggregateOutputType | null
    _sum: BookingVisitSumAggregateOutputType | null
    _min: BookingVisitMinAggregateOutputType | null
    _max: BookingVisitMaxAggregateOutputType | null
  }

  type GetBookingVisitGroupByPayload<T extends BookingVisitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingVisitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingVisitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingVisitGroupByOutputType[P]>
            : GetScalarType<T[P], BookingVisitGroupByOutputType[P]>
        }
      >
    >


  export type BookingVisitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    partnerId?: boolean
    durationMs?: boolean
    visitedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    partner?: boolean | BookingPartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingVisit"]>

  export type BookingVisitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    partnerId?: boolean
    durationMs?: boolean
    visitedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    partner?: boolean | BookingPartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingVisit"]>

  export type BookingVisitSelectScalar = {
    id?: boolean
    userId?: boolean
    partnerId?: boolean
    durationMs?: boolean
    visitedAt?: boolean
  }

  export type BookingVisitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    partner?: boolean | BookingPartnerDefaultArgs<ExtArgs>
  }
  export type BookingVisitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    partner?: boolean | BookingPartnerDefaultArgs<ExtArgs>
  }

  export type $BookingVisitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingVisit"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      partner: Prisma.$BookingPartnerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      partnerId: string
      durationMs: number
      visitedAt: Date
    }, ExtArgs["result"]["bookingVisit"]>
    composites: {}
  }

  type BookingVisitGetPayload<S extends boolean | null | undefined | BookingVisitDefaultArgs> = $Result.GetResult<Prisma.$BookingVisitPayload, S>

  type BookingVisitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookingVisitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookingVisitCountAggregateInputType | true
    }

  export interface BookingVisitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingVisit'], meta: { name: 'BookingVisit' } }
    /**
     * Find zero or one BookingVisit that matches the filter.
     * @param {BookingVisitFindUniqueArgs} args - Arguments to find a BookingVisit
     * @example
     * // Get one BookingVisit
     * const bookingVisit = await prisma.bookingVisit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingVisitFindUniqueArgs>(args: SelectSubset<T, BookingVisitFindUniqueArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BookingVisit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookingVisitFindUniqueOrThrowArgs} args - Arguments to find a BookingVisit
     * @example
     * // Get one BookingVisit
     * const bookingVisit = await prisma.bookingVisit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingVisitFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingVisitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BookingVisit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitFindFirstArgs} args - Arguments to find a BookingVisit
     * @example
     * // Get one BookingVisit
     * const bookingVisit = await prisma.bookingVisit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingVisitFindFirstArgs>(args?: SelectSubset<T, BookingVisitFindFirstArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BookingVisit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitFindFirstOrThrowArgs} args - Arguments to find a BookingVisit
     * @example
     * // Get one BookingVisit
     * const bookingVisit = await prisma.bookingVisit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingVisitFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingVisitFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BookingVisits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingVisits
     * const bookingVisits = await prisma.bookingVisit.findMany()
     * 
     * // Get first 10 BookingVisits
     * const bookingVisits = await prisma.bookingVisit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingVisitWithIdOnly = await prisma.bookingVisit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingVisitFindManyArgs>(args?: SelectSubset<T, BookingVisitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BookingVisit.
     * @param {BookingVisitCreateArgs} args - Arguments to create a BookingVisit.
     * @example
     * // Create one BookingVisit
     * const BookingVisit = await prisma.bookingVisit.create({
     *   data: {
     *     // ... data to create a BookingVisit
     *   }
     * })
     * 
     */
    create<T extends BookingVisitCreateArgs>(args: SelectSubset<T, BookingVisitCreateArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BookingVisits.
     * @param {BookingVisitCreateManyArgs} args - Arguments to create many BookingVisits.
     * @example
     * // Create many BookingVisits
     * const bookingVisit = await prisma.bookingVisit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingVisitCreateManyArgs>(args?: SelectSubset<T, BookingVisitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingVisits and returns the data saved in the database.
     * @param {BookingVisitCreateManyAndReturnArgs} args - Arguments to create many BookingVisits.
     * @example
     * // Create many BookingVisits
     * const bookingVisit = await prisma.bookingVisit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingVisits and only return the `id`
     * const bookingVisitWithIdOnly = await prisma.bookingVisit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingVisitCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingVisitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BookingVisit.
     * @param {BookingVisitDeleteArgs} args - Arguments to delete one BookingVisit.
     * @example
     * // Delete one BookingVisit
     * const BookingVisit = await prisma.bookingVisit.delete({
     *   where: {
     *     // ... filter to delete one BookingVisit
     *   }
     * })
     * 
     */
    delete<T extends BookingVisitDeleteArgs>(args: SelectSubset<T, BookingVisitDeleteArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BookingVisit.
     * @param {BookingVisitUpdateArgs} args - Arguments to update one BookingVisit.
     * @example
     * // Update one BookingVisit
     * const bookingVisit = await prisma.bookingVisit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingVisitUpdateArgs>(args: SelectSubset<T, BookingVisitUpdateArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BookingVisits.
     * @param {BookingVisitDeleteManyArgs} args - Arguments to filter BookingVisits to delete.
     * @example
     * // Delete a few BookingVisits
     * const { count } = await prisma.bookingVisit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingVisitDeleteManyArgs>(args?: SelectSubset<T, BookingVisitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingVisits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingVisits
     * const bookingVisit = await prisma.bookingVisit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingVisitUpdateManyArgs>(args: SelectSubset<T, BookingVisitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BookingVisit.
     * @param {BookingVisitUpsertArgs} args - Arguments to update or create a BookingVisit.
     * @example
     * // Update or create a BookingVisit
     * const bookingVisit = await prisma.bookingVisit.upsert({
     *   create: {
     *     // ... data to create a BookingVisit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingVisit we want to update
     *   }
     * })
     */
    upsert<T extends BookingVisitUpsertArgs>(args: SelectSubset<T, BookingVisitUpsertArgs<ExtArgs>>): Prisma__BookingVisitClient<$Result.GetResult<Prisma.$BookingVisitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BookingVisits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitCountArgs} args - Arguments to filter BookingVisits to count.
     * @example
     * // Count the number of BookingVisits
     * const count = await prisma.bookingVisit.count({
     *   where: {
     *     // ... the filter for the BookingVisits we want to count
     *   }
     * })
    **/
    count<T extends BookingVisitCountArgs>(
      args?: Subset<T, BookingVisitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingVisitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingVisit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingVisitAggregateArgs>(args: Subset<T, BookingVisitAggregateArgs>): Prisma.PrismaPromise<GetBookingVisitAggregateType<T>>

    /**
     * Group by BookingVisit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingVisitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingVisitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingVisitGroupByArgs['orderBy'] }
        : { orderBy?: BookingVisitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingVisitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingVisitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingVisit model
   */
  readonly fields: BookingVisitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingVisit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingVisitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    partner<T extends BookingPartnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingPartnerDefaultArgs<ExtArgs>>): Prisma__BookingPartnerClient<$Result.GetResult<Prisma.$BookingPartnerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingVisit model
   */ 
  interface BookingVisitFieldRefs {
    readonly id: FieldRef<"BookingVisit", 'String'>
    readonly userId: FieldRef<"BookingVisit", 'String'>
    readonly partnerId: FieldRef<"BookingVisit", 'String'>
    readonly durationMs: FieldRef<"BookingVisit", 'Int'>
    readonly visitedAt: FieldRef<"BookingVisit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookingVisit findUnique
   */
  export type BookingVisitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * Filter, which BookingVisit to fetch.
     */
    where: BookingVisitWhereUniqueInput
  }

  /**
   * BookingVisit findUniqueOrThrow
   */
  export type BookingVisitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * Filter, which BookingVisit to fetch.
     */
    where: BookingVisitWhereUniqueInput
  }

  /**
   * BookingVisit findFirst
   */
  export type BookingVisitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * Filter, which BookingVisit to fetch.
     */
    where?: BookingVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingVisits to fetch.
     */
    orderBy?: BookingVisitOrderByWithRelationInput | BookingVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingVisits.
     */
    cursor?: BookingVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingVisits.
     */
    distinct?: BookingVisitScalarFieldEnum | BookingVisitScalarFieldEnum[]
  }

  /**
   * BookingVisit findFirstOrThrow
   */
  export type BookingVisitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * Filter, which BookingVisit to fetch.
     */
    where?: BookingVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingVisits to fetch.
     */
    orderBy?: BookingVisitOrderByWithRelationInput | BookingVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingVisits.
     */
    cursor?: BookingVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingVisits.
     */
    distinct?: BookingVisitScalarFieldEnum | BookingVisitScalarFieldEnum[]
  }

  /**
   * BookingVisit findMany
   */
  export type BookingVisitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * Filter, which BookingVisits to fetch.
     */
    where?: BookingVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingVisits to fetch.
     */
    orderBy?: BookingVisitOrderByWithRelationInput | BookingVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingVisits.
     */
    cursor?: BookingVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingVisits.
     */
    skip?: number
    distinct?: BookingVisitScalarFieldEnum | BookingVisitScalarFieldEnum[]
  }

  /**
   * BookingVisit create
   */
  export type BookingVisitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingVisit.
     */
    data: XOR<BookingVisitCreateInput, BookingVisitUncheckedCreateInput>
  }

  /**
   * BookingVisit createMany
   */
  export type BookingVisitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingVisits.
     */
    data: BookingVisitCreateManyInput | BookingVisitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingVisit createManyAndReturn
   */
  export type BookingVisitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BookingVisits.
     */
    data: BookingVisitCreateManyInput | BookingVisitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingVisit update
   */
  export type BookingVisitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingVisit.
     */
    data: XOR<BookingVisitUpdateInput, BookingVisitUncheckedUpdateInput>
    /**
     * Choose, which BookingVisit to update.
     */
    where: BookingVisitWhereUniqueInput
  }

  /**
   * BookingVisit updateMany
   */
  export type BookingVisitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingVisits.
     */
    data: XOR<BookingVisitUpdateManyMutationInput, BookingVisitUncheckedUpdateManyInput>
    /**
     * Filter which BookingVisits to update
     */
    where?: BookingVisitWhereInput
  }

  /**
   * BookingVisit upsert
   */
  export type BookingVisitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingVisit to update in case it exists.
     */
    where: BookingVisitWhereUniqueInput
    /**
     * In case the BookingVisit found by the `where` argument doesn't exist, create a new BookingVisit with this data.
     */
    create: XOR<BookingVisitCreateInput, BookingVisitUncheckedCreateInput>
    /**
     * In case the BookingVisit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingVisitUpdateInput, BookingVisitUncheckedUpdateInput>
  }

  /**
   * BookingVisit delete
   */
  export type BookingVisitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
    /**
     * Filter which BookingVisit to delete.
     */
    where: BookingVisitWhereUniqueInput
  }

  /**
   * BookingVisit deleteMany
   */
  export type BookingVisitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingVisits to delete
     */
    where?: BookingVisitWhereInput
  }

  /**
   * BookingVisit without action
   */
  export type BookingVisitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingVisit
     */
    select?: BookingVisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingVisitInclude<ExtArgs> | null
  }


  /**
   * Model SOSAlert
   */

  export type AggregateSOSAlert = {
    _count: SOSAlertCountAggregateOutputType | null
    _avg: SOSAlertAvgAggregateOutputType | null
    _sum: SOSAlertSumAggregateOutputType | null
    _min: SOSAlertMinAggregateOutputType | null
    _max: SOSAlertMaxAggregateOutputType | null
  }

  export type SOSAlertAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type SOSAlertSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type SOSAlertMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.SOSStatus | null
    latitude: number | null
    longitude: number | null
    address: string | null
    resolvedAt: Date | null
    cancelledAt: Date | null
    acknowledgedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SOSAlertMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.SOSStatus | null
    latitude: number | null
    longitude: number | null
    address: string | null
    resolvedAt: Date | null
    cancelledAt: Date | null
    acknowledgedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SOSAlertCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    latitude: number
    longitude: number
    address: number
    emergencyContacts: number
    resolvedAt: number
    cancelledAt: number
    acknowledgedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SOSAlertAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type SOSAlertSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type SOSAlertMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    latitude?: true
    longitude?: true
    address?: true
    resolvedAt?: true
    cancelledAt?: true
    acknowledgedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SOSAlertMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    latitude?: true
    longitude?: true
    address?: true
    resolvedAt?: true
    cancelledAt?: true
    acknowledgedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SOSAlertCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    latitude?: true
    longitude?: true
    address?: true
    emergencyContacts?: true
    resolvedAt?: true
    cancelledAt?: true
    acknowledgedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SOSAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SOSAlert to aggregate.
     */
    where?: SOSAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SOSAlerts to fetch.
     */
    orderBy?: SOSAlertOrderByWithRelationInput | SOSAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SOSAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SOSAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SOSAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SOSAlerts
    **/
    _count?: true | SOSAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SOSAlertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SOSAlertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SOSAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SOSAlertMaxAggregateInputType
  }

  export type GetSOSAlertAggregateType<T extends SOSAlertAggregateArgs> = {
        [P in keyof T & keyof AggregateSOSAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSOSAlert[P]>
      : GetScalarType<T[P], AggregateSOSAlert[P]>
  }




  export type SOSAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SOSAlertWhereInput
    orderBy?: SOSAlertOrderByWithAggregationInput | SOSAlertOrderByWithAggregationInput[]
    by: SOSAlertScalarFieldEnum[] | SOSAlertScalarFieldEnum
    having?: SOSAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SOSAlertCountAggregateInputType | true
    _avg?: SOSAlertAvgAggregateInputType
    _sum?: SOSAlertSumAggregateInputType
    _min?: SOSAlertMinAggregateInputType
    _max?: SOSAlertMaxAggregateInputType
  }

  export type SOSAlertGroupByOutputType = {
    id: string
    userId: string
    status: $Enums.SOSStatus
    latitude: number | null
    longitude: number | null
    address: string | null
    emergencyContacts: JsonValue | null
    resolvedAt: Date | null
    cancelledAt: Date | null
    acknowledgedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SOSAlertCountAggregateOutputType | null
    _avg: SOSAlertAvgAggregateOutputType | null
    _sum: SOSAlertSumAggregateOutputType | null
    _min: SOSAlertMinAggregateOutputType | null
    _max: SOSAlertMaxAggregateOutputType | null
  }

  type GetSOSAlertGroupByPayload<T extends SOSAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SOSAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SOSAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SOSAlertGroupByOutputType[P]>
            : GetScalarType<T[P], SOSAlertGroupByOutputType[P]>
        }
      >
    >


  export type SOSAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    emergencyContacts?: boolean
    resolvedAt?: boolean
    cancelledAt?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sOSAlert"]>

  export type SOSAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    emergencyContacts?: boolean
    resolvedAt?: boolean
    cancelledAt?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sOSAlert"]>

  export type SOSAlertSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    emergencyContacts?: boolean
    resolvedAt?: boolean
    cancelledAt?: boolean
    acknowledgedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SOSAlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SOSAlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SOSAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SOSAlert"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: $Enums.SOSStatus
      latitude: number | null
      longitude: number | null
      address: string | null
      emergencyContacts: Prisma.JsonValue | null
      resolvedAt: Date | null
      cancelledAt: Date | null
      acknowledgedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sOSAlert"]>
    composites: {}
  }

  type SOSAlertGetPayload<S extends boolean | null | undefined | SOSAlertDefaultArgs> = $Result.GetResult<Prisma.$SOSAlertPayload, S>

  type SOSAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SOSAlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SOSAlertCountAggregateInputType | true
    }

  export interface SOSAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SOSAlert'], meta: { name: 'SOSAlert' } }
    /**
     * Find zero or one SOSAlert that matches the filter.
     * @param {SOSAlertFindUniqueArgs} args - Arguments to find a SOSAlert
     * @example
     * // Get one SOSAlert
     * const sOSAlert = await prisma.sOSAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SOSAlertFindUniqueArgs>(args: SelectSubset<T, SOSAlertFindUniqueArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SOSAlert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SOSAlertFindUniqueOrThrowArgs} args - Arguments to find a SOSAlert
     * @example
     * // Get one SOSAlert
     * const sOSAlert = await prisma.sOSAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SOSAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, SOSAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SOSAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertFindFirstArgs} args - Arguments to find a SOSAlert
     * @example
     * // Get one SOSAlert
     * const sOSAlert = await prisma.sOSAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SOSAlertFindFirstArgs>(args?: SelectSubset<T, SOSAlertFindFirstArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SOSAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertFindFirstOrThrowArgs} args - Arguments to find a SOSAlert
     * @example
     * // Get one SOSAlert
     * const sOSAlert = await prisma.sOSAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SOSAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, SOSAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SOSAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SOSAlerts
     * const sOSAlerts = await prisma.sOSAlert.findMany()
     * 
     * // Get first 10 SOSAlerts
     * const sOSAlerts = await prisma.sOSAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sOSAlertWithIdOnly = await prisma.sOSAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SOSAlertFindManyArgs>(args?: SelectSubset<T, SOSAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SOSAlert.
     * @param {SOSAlertCreateArgs} args - Arguments to create a SOSAlert.
     * @example
     * // Create one SOSAlert
     * const SOSAlert = await prisma.sOSAlert.create({
     *   data: {
     *     // ... data to create a SOSAlert
     *   }
     * })
     * 
     */
    create<T extends SOSAlertCreateArgs>(args: SelectSubset<T, SOSAlertCreateArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SOSAlerts.
     * @param {SOSAlertCreateManyArgs} args - Arguments to create many SOSAlerts.
     * @example
     * // Create many SOSAlerts
     * const sOSAlert = await prisma.sOSAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SOSAlertCreateManyArgs>(args?: SelectSubset<T, SOSAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SOSAlerts and returns the data saved in the database.
     * @param {SOSAlertCreateManyAndReturnArgs} args - Arguments to create many SOSAlerts.
     * @example
     * // Create many SOSAlerts
     * const sOSAlert = await prisma.sOSAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SOSAlerts and only return the `id`
     * const sOSAlertWithIdOnly = await prisma.sOSAlert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SOSAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, SOSAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SOSAlert.
     * @param {SOSAlertDeleteArgs} args - Arguments to delete one SOSAlert.
     * @example
     * // Delete one SOSAlert
     * const SOSAlert = await prisma.sOSAlert.delete({
     *   where: {
     *     // ... filter to delete one SOSAlert
     *   }
     * })
     * 
     */
    delete<T extends SOSAlertDeleteArgs>(args: SelectSubset<T, SOSAlertDeleteArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SOSAlert.
     * @param {SOSAlertUpdateArgs} args - Arguments to update one SOSAlert.
     * @example
     * // Update one SOSAlert
     * const sOSAlert = await prisma.sOSAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SOSAlertUpdateArgs>(args: SelectSubset<T, SOSAlertUpdateArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SOSAlerts.
     * @param {SOSAlertDeleteManyArgs} args - Arguments to filter SOSAlerts to delete.
     * @example
     * // Delete a few SOSAlerts
     * const { count } = await prisma.sOSAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SOSAlertDeleteManyArgs>(args?: SelectSubset<T, SOSAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SOSAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SOSAlerts
     * const sOSAlert = await prisma.sOSAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SOSAlertUpdateManyArgs>(args: SelectSubset<T, SOSAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SOSAlert.
     * @param {SOSAlertUpsertArgs} args - Arguments to update or create a SOSAlert.
     * @example
     * // Update or create a SOSAlert
     * const sOSAlert = await prisma.sOSAlert.upsert({
     *   create: {
     *     // ... data to create a SOSAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SOSAlert we want to update
     *   }
     * })
     */
    upsert<T extends SOSAlertUpsertArgs>(args: SelectSubset<T, SOSAlertUpsertArgs<ExtArgs>>): Prisma__SOSAlertClient<$Result.GetResult<Prisma.$SOSAlertPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SOSAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertCountArgs} args - Arguments to filter SOSAlerts to count.
     * @example
     * // Count the number of SOSAlerts
     * const count = await prisma.sOSAlert.count({
     *   where: {
     *     // ... the filter for the SOSAlerts we want to count
     *   }
     * })
    **/
    count<T extends SOSAlertCountArgs>(
      args?: Subset<T, SOSAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SOSAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SOSAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SOSAlertAggregateArgs>(args: Subset<T, SOSAlertAggregateArgs>): Prisma.PrismaPromise<GetSOSAlertAggregateType<T>>

    /**
     * Group by SOSAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SOSAlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SOSAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SOSAlertGroupByArgs['orderBy'] }
        : { orderBy?: SOSAlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SOSAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSOSAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SOSAlert model
   */
  readonly fields: SOSAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SOSAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SOSAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SOSAlert model
   */ 
  interface SOSAlertFieldRefs {
    readonly id: FieldRef<"SOSAlert", 'String'>
    readonly userId: FieldRef<"SOSAlert", 'String'>
    readonly status: FieldRef<"SOSAlert", 'SOSStatus'>
    readonly latitude: FieldRef<"SOSAlert", 'Float'>
    readonly longitude: FieldRef<"SOSAlert", 'Float'>
    readonly address: FieldRef<"SOSAlert", 'String'>
    readonly emergencyContacts: FieldRef<"SOSAlert", 'Json'>
    readonly resolvedAt: FieldRef<"SOSAlert", 'DateTime'>
    readonly cancelledAt: FieldRef<"SOSAlert", 'DateTime'>
    readonly acknowledgedAt: FieldRef<"SOSAlert", 'DateTime'>
    readonly createdAt: FieldRef<"SOSAlert", 'DateTime'>
    readonly updatedAt: FieldRef<"SOSAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SOSAlert findUnique
   */
  export type SOSAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * Filter, which SOSAlert to fetch.
     */
    where: SOSAlertWhereUniqueInput
  }

  /**
   * SOSAlert findUniqueOrThrow
   */
  export type SOSAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * Filter, which SOSAlert to fetch.
     */
    where: SOSAlertWhereUniqueInput
  }

  /**
   * SOSAlert findFirst
   */
  export type SOSAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * Filter, which SOSAlert to fetch.
     */
    where?: SOSAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SOSAlerts to fetch.
     */
    orderBy?: SOSAlertOrderByWithRelationInput | SOSAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SOSAlerts.
     */
    cursor?: SOSAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SOSAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SOSAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SOSAlerts.
     */
    distinct?: SOSAlertScalarFieldEnum | SOSAlertScalarFieldEnum[]
  }

  /**
   * SOSAlert findFirstOrThrow
   */
  export type SOSAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * Filter, which SOSAlert to fetch.
     */
    where?: SOSAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SOSAlerts to fetch.
     */
    orderBy?: SOSAlertOrderByWithRelationInput | SOSAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SOSAlerts.
     */
    cursor?: SOSAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SOSAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SOSAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SOSAlerts.
     */
    distinct?: SOSAlertScalarFieldEnum | SOSAlertScalarFieldEnum[]
  }

  /**
   * SOSAlert findMany
   */
  export type SOSAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * Filter, which SOSAlerts to fetch.
     */
    where?: SOSAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SOSAlerts to fetch.
     */
    orderBy?: SOSAlertOrderByWithRelationInput | SOSAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SOSAlerts.
     */
    cursor?: SOSAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SOSAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SOSAlerts.
     */
    skip?: number
    distinct?: SOSAlertScalarFieldEnum | SOSAlertScalarFieldEnum[]
  }

  /**
   * SOSAlert create
   */
  export type SOSAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * The data needed to create a SOSAlert.
     */
    data: XOR<SOSAlertCreateInput, SOSAlertUncheckedCreateInput>
  }

  /**
   * SOSAlert createMany
   */
  export type SOSAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SOSAlerts.
     */
    data: SOSAlertCreateManyInput | SOSAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SOSAlert createManyAndReturn
   */
  export type SOSAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SOSAlerts.
     */
    data: SOSAlertCreateManyInput | SOSAlertCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SOSAlert update
   */
  export type SOSAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * The data needed to update a SOSAlert.
     */
    data: XOR<SOSAlertUpdateInput, SOSAlertUncheckedUpdateInput>
    /**
     * Choose, which SOSAlert to update.
     */
    where: SOSAlertWhereUniqueInput
  }

  /**
   * SOSAlert updateMany
   */
  export type SOSAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SOSAlerts.
     */
    data: XOR<SOSAlertUpdateManyMutationInput, SOSAlertUncheckedUpdateManyInput>
    /**
     * Filter which SOSAlerts to update
     */
    where?: SOSAlertWhereInput
  }

  /**
   * SOSAlert upsert
   */
  export type SOSAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * The filter to search for the SOSAlert to update in case it exists.
     */
    where: SOSAlertWhereUniqueInput
    /**
     * In case the SOSAlert found by the `where` argument doesn't exist, create a new SOSAlert with this data.
     */
    create: XOR<SOSAlertCreateInput, SOSAlertUncheckedCreateInput>
    /**
     * In case the SOSAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SOSAlertUpdateInput, SOSAlertUncheckedUpdateInput>
  }

  /**
   * SOSAlert delete
   */
  export type SOSAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
    /**
     * Filter which SOSAlert to delete.
     */
    where: SOSAlertWhereUniqueInput
  }

  /**
   * SOSAlert deleteMany
   */
  export type SOSAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SOSAlerts to delete
     */
    where?: SOSAlertWhereInput
  }

  /**
   * SOSAlert without action
   */
  export type SOSAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SOSAlert
     */
    select?: SOSAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SOSAlertInclude<ExtArgs> | null
  }


  /**
   * Model SupportTicket
   */

  export type AggregateSupportTicket = {
    _count: SupportTicketCountAggregateOutputType | null
    _avg: SupportTicketAvgAggregateOutputType | null
    _sum: SupportTicketSumAggregateOutputType | null
    _min: SupportTicketMinAggregateOutputType | null
    _max: SupportTicketMaxAggregateOutputType | null
  }

  export type SupportTicketAvgAggregateOutputType = {
    ticketNumber: number | null
  }

  export type SupportTicketSumAggregateOutputType = {
    ticketNumber: number | null
  }

  export type SupportTicketMinAggregateOutputType = {
    id: string | null
    ticketNumber: number | null
    userId: string | null
    name: string | null
    email: string | null
    subject: string | null
    message: string | null
    status: $Enums.TicketStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupportTicketMaxAggregateOutputType = {
    id: string | null
    ticketNumber: number | null
    userId: string | null
    name: string | null
    email: string | null
    subject: string | null
    message: string | null
    status: $Enums.TicketStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupportTicketCountAggregateOutputType = {
    id: number
    ticketNumber: number
    userId: number
    name: number
    email: number
    subject: number
    message: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupportTicketAvgAggregateInputType = {
    ticketNumber?: true
  }

  export type SupportTicketSumAggregateInputType = {
    ticketNumber?: true
  }

  export type SupportTicketMinAggregateInputType = {
    id?: true
    ticketNumber?: true
    userId?: true
    name?: true
    email?: true
    subject?: true
    message?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupportTicketMaxAggregateInputType = {
    id?: true
    ticketNumber?: true
    userId?: true
    name?: true
    email?: true
    subject?: true
    message?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupportTicketCountAggregateInputType = {
    id?: true
    ticketNumber?: true
    userId?: true
    name?: true
    email?: true
    subject?: true
    message?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupportTicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupportTicket to aggregate.
     */
    where?: SupportTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportTickets to fetch.
     */
    orderBy?: SupportTicketOrderByWithRelationInput | SupportTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupportTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupportTickets
    **/
    _count?: true | SupportTicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupportTicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupportTicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupportTicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupportTicketMaxAggregateInputType
  }

  export type GetSupportTicketAggregateType<T extends SupportTicketAggregateArgs> = {
        [P in keyof T & keyof AggregateSupportTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupportTicket[P]>
      : GetScalarType<T[P], AggregateSupportTicket[P]>
  }




  export type SupportTicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupportTicketWhereInput
    orderBy?: SupportTicketOrderByWithAggregationInput | SupportTicketOrderByWithAggregationInput[]
    by: SupportTicketScalarFieldEnum[] | SupportTicketScalarFieldEnum
    having?: SupportTicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupportTicketCountAggregateInputType | true
    _avg?: SupportTicketAvgAggregateInputType
    _sum?: SupportTicketSumAggregateInputType
    _min?: SupportTicketMinAggregateInputType
    _max?: SupportTicketMaxAggregateInputType
  }

  export type SupportTicketGroupByOutputType = {
    id: string
    ticketNumber: number
    userId: string | null
    name: string
    email: string
    subject: string
    message: string
    status: $Enums.TicketStatus
    createdAt: Date
    updatedAt: Date
    _count: SupportTicketCountAggregateOutputType | null
    _avg: SupportTicketAvgAggregateOutputType | null
    _sum: SupportTicketSumAggregateOutputType | null
    _min: SupportTicketMinAggregateOutputType | null
    _max: SupportTicketMaxAggregateOutputType | null
  }

  type GetSupportTicketGroupByPayload<T extends SupportTicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupportTicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupportTicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupportTicketGroupByOutputType[P]>
            : GetScalarType<T[P], SupportTicketGroupByOutputType[P]>
        }
      >
    >


  export type SupportTicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketNumber?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | SupportTicket$userArgs<ExtArgs>
  }, ExtArgs["result"]["supportTicket"]>

  export type SupportTicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketNumber?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | SupportTicket$userArgs<ExtArgs>
  }, ExtArgs["result"]["supportTicket"]>

  export type SupportTicketSelectScalar = {
    id?: boolean
    ticketNumber?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    subject?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupportTicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | SupportTicket$userArgs<ExtArgs>
  }
  export type SupportTicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | SupportTicket$userArgs<ExtArgs>
  }

  export type $SupportTicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupportTicket"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketNumber: number
      userId: string | null
      name: string
      email: string
      subject: string
      message: string
      status: $Enums.TicketStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supportTicket"]>
    composites: {}
  }

  type SupportTicketGetPayload<S extends boolean | null | undefined | SupportTicketDefaultArgs> = $Result.GetResult<Prisma.$SupportTicketPayload, S>

  type SupportTicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SupportTicketFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SupportTicketCountAggregateInputType | true
    }

  export interface SupportTicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupportTicket'], meta: { name: 'SupportTicket' } }
    /**
     * Find zero or one SupportTicket that matches the filter.
     * @param {SupportTicketFindUniqueArgs} args - Arguments to find a SupportTicket
     * @example
     * // Get one SupportTicket
     * const supportTicket = await prisma.supportTicket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupportTicketFindUniqueArgs>(args: SelectSubset<T, SupportTicketFindUniqueArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SupportTicket that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SupportTicketFindUniqueOrThrowArgs} args - Arguments to find a SupportTicket
     * @example
     * // Get one SupportTicket
     * const supportTicket = await prisma.supportTicket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupportTicketFindUniqueOrThrowArgs>(args: SelectSubset<T, SupportTicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SupportTicket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketFindFirstArgs} args - Arguments to find a SupportTicket
     * @example
     * // Get one SupportTicket
     * const supportTicket = await prisma.supportTicket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupportTicketFindFirstArgs>(args?: SelectSubset<T, SupportTicketFindFirstArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SupportTicket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketFindFirstOrThrowArgs} args - Arguments to find a SupportTicket
     * @example
     * // Get one SupportTicket
     * const supportTicket = await prisma.supportTicket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupportTicketFindFirstOrThrowArgs>(args?: SelectSubset<T, SupportTicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SupportTickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupportTickets
     * const supportTickets = await prisma.supportTicket.findMany()
     * 
     * // Get first 10 SupportTickets
     * const supportTickets = await prisma.supportTicket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supportTicketWithIdOnly = await prisma.supportTicket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupportTicketFindManyArgs>(args?: SelectSubset<T, SupportTicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SupportTicket.
     * @param {SupportTicketCreateArgs} args - Arguments to create a SupportTicket.
     * @example
     * // Create one SupportTicket
     * const SupportTicket = await prisma.supportTicket.create({
     *   data: {
     *     // ... data to create a SupportTicket
     *   }
     * })
     * 
     */
    create<T extends SupportTicketCreateArgs>(args: SelectSubset<T, SupportTicketCreateArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SupportTickets.
     * @param {SupportTicketCreateManyArgs} args - Arguments to create many SupportTickets.
     * @example
     * // Create many SupportTickets
     * const supportTicket = await prisma.supportTicket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupportTicketCreateManyArgs>(args?: SelectSubset<T, SupportTicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupportTickets and returns the data saved in the database.
     * @param {SupportTicketCreateManyAndReturnArgs} args - Arguments to create many SupportTickets.
     * @example
     * // Create many SupportTickets
     * const supportTicket = await prisma.supportTicket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupportTickets and only return the `id`
     * const supportTicketWithIdOnly = await prisma.supportTicket.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupportTicketCreateManyAndReturnArgs>(args?: SelectSubset<T, SupportTicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SupportTicket.
     * @param {SupportTicketDeleteArgs} args - Arguments to delete one SupportTicket.
     * @example
     * // Delete one SupportTicket
     * const SupportTicket = await prisma.supportTicket.delete({
     *   where: {
     *     // ... filter to delete one SupportTicket
     *   }
     * })
     * 
     */
    delete<T extends SupportTicketDeleteArgs>(args: SelectSubset<T, SupportTicketDeleteArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SupportTicket.
     * @param {SupportTicketUpdateArgs} args - Arguments to update one SupportTicket.
     * @example
     * // Update one SupportTicket
     * const supportTicket = await prisma.supportTicket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupportTicketUpdateArgs>(args: SelectSubset<T, SupportTicketUpdateArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SupportTickets.
     * @param {SupportTicketDeleteManyArgs} args - Arguments to filter SupportTickets to delete.
     * @example
     * // Delete a few SupportTickets
     * const { count } = await prisma.supportTicket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupportTicketDeleteManyArgs>(args?: SelectSubset<T, SupportTicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupportTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupportTickets
     * const supportTicket = await prisma.supportTicket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupportTicketUpdateManyArgs>(args: SelectSubset<T, SupportTicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SupportTicket.
     * @param {SupportTicketUpsertArgs} args - Arguments to update or create a SupportTicket.
     * @example
     * // Update or create a SupportTicket
     * const supportTicket = await prisma.supportTicket.upsert({
     *   create: {
     *     // ... data to create a SupportTicket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupportTicket we want to update
     *   }
     * })
     */
    upsert<T extends SupportTicketUpsertArgs>(args: SelectSubset<T, SupportTicketUpsertArgs<ExtArgs>>): Prisma__SupportTicketClient<$Result.GetResult<Prisma.$SupportTicketPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SupportTickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketCountArgs} args - Arguments to filter SupportTickets to count.
     * @example
     * // Count the number of SupportTickets
     * const count = await prisma.supportTicket.count({
     *   where: {
     *     // ... the filter for the SupportTickets we want to count
     *   }
     * })
    **/
    count<T extends SupportTicketCountArgs>(
      args?: Subset<T, SupportTicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupportTicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupportTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupportTicketAggregateArgs>(args: Subset<T, SupportTicketAggregateArgs>): Prisma.PrismaPromise<GetSupportTicketAggregateType<T>>

    /**
     * Group by SupportTicket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupportTicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupportTicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupportTicketGroupByArgs['orderBy'] }
        : { orderBy?: SupportTicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupportTicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupportTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupportTicket model
   */
  readonly fields: SupportTicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupportTicket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupportTicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends SupportTicket$userArgs<ExtArgs> = {}>(args?: Subset<T, SupportTicket$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SupportTicket model
   */ 
  interface SupportTicketFieldRefs {
    readonly id: FieldRef<"SupportTicket", 'String'>
    readonly ticketNumber: FieldRef<"SupportTicket", 'Int'>
    readonly userId: FieldRef<"SupportTicket", 'String'>
    readonly name: FieldRef<"SupportTicket", 'String'>
    readonly email: FieldRef<"SupportTicket", 'String'>
    readonly subject: FieldRef<"SupportTicket", 'String'>
    readonly message: FieldRef<"SupportTicket", 'String'>
    readonly status: FieldRef<"SupportTicket", 'TicketStatus'>
    readonly createdAt: FieldRef<"SupportTicket", 'DateTime'>
    readonly updatedAt: FieldRef<"SupportTicket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupportTicket findUnique
   */
  export type SupportTicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * Filter, which SupportTicket to fetch.
     */
    where: SupportTicketWhereUniqueInput
  }

  /**
   * SupportTicket findUniqueOrThrow
   */
  export type SupportTicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * Filter, which SupportTicket to fetch.
     */
    where: SupportTicketWhereUniqueInput
  }

  /**
   * SupportTicket findFirst
   */
  export type SupportTicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * Filter, which SupportTicket to fetch.
     */
    where?: SupportTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportTickets to fetch.
     */
    orderBy?: SupportTicketOrderByWithRelationInput | SupportTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupportTickets.
     */
    cursor?: SupportTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupportTickets.
     */
    distinct?: SupportTicketScalarFieldEnum | SupportTicketScalarFieldEnum[]
  }

  /**
   * SupportTicket findFirstOrThrow
   */
  export type SupportTicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * Filter, which SupportTicket to fetch.
     */
    where?: SupportTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportTickets to fetch.
     */
    orderBy?: SupportTicketOrderByWithRelationInput | SupportTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupportTickets.
     */
    cursor?: SupportTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportTickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupportTickets.
     */
    distinct?: SupportTicketScalarFieldEnum | SupportTicketScalarFieldEnum[]
  }

  /**
   * SupportTicket findMany
   */
  export type SupportTicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * Filter, which SupportTickets to fetch.
     */
    where?: SupportTicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupportTickets to fetch.
     */
    orderBy?: SupportTicketOrderByWithRelationInput | SupportTicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupportTickets.
     */
    cursor?: SupportTicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupportTickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupportTickets.
     */
    skip?: number
    distinct?: SupportTicketScalarFieldEnum | SupportTicketScalarFieldEnum[]
  }

  /**
   * SupportTicket create
   */
  export type SupportTicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * The data needed to create a SupportTicket.
     */
    data: XOR<SupportTicketCreateInput, SupportTicketUncheckedCreateInput>
  }

  /**
   * SupportTicket createMany
   */
  export type SupportTicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupportTickets.
     */
    data: SupportTicketCreateManyInput | SupportTicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupportTicket createManyAndReturn
   */
  export type SupportTicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SupportTickets.
     */
    data: SupportTicketCreateManyInput | SupportTicketCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SupportTicket update
   */
  export type SupportTicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * The data needed to update a SupportTicket.
     */
    data: XOR<SupportTicketUpdateInput, SupportTicketUncheckedUpdateInput>
    /**
     * Choose, which SupportTicket to update.
     */
    where: SupportTicketWhereUniqueInput
  }

  /**
   * SupportTicket updateMany
   */
  export type SupportTicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupportTickets.
     */
    data: XOR<SupportTicketUpdateManyMutationInput, SupportTicketUncheckedUpdateManyInput>
    /**
     * Filter which SupportTickets to update
     */
    where?: SupportTicketWhereInput
  }

  /**
   * SupportTicket upsert
   */
  export type SupportTicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * The filter to search for the SupportTicket to update in case it exists.
     */
    where: SupportTicketWhereUniqueInput
    /**
     * In case the SupportTicket found by the `where` argument doesn't exist, create a new SupportTicket with this data.
     */
    create: XOR<SupportTicketCreateInput, SupportTicketUncheckedCreateInput>
    /**
     * In case the SupportTicket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupportTicketUpdateInput, SupportTicketUncheckedUpdateInput>
  }

  /**
   * SupportTicket delete
   */
  export type SupportTicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
    /**
     * Filter which SupportTicket to delete.
     */
    where: SupportTicketWhereUniqueInput
  }

  /**
   * SupportTicket deleteMany
   */
  export type SupportTicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupportTickets to delete
     */
    where?: SupportTicketWhereInput
  }

  /**
   * SupportTicket.user
   */
  export type SupportTicket$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * SupportTicket without action
   */
  export type SupportTicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupportTicket
     */
    select?: SupportTicketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupportTicketInclude<ExtArgs> | null
  }


  /**
   * Model SafetyAlert
   */

  export type AggregateSafetyAlert = {
    _count: SafetyAlertCountAggregateOutputType | null
    _min: SafetyAlertMinAggregateOutputType | null
    _max: SafetyAlertMaxAggregateOutputType | null
  }

  export type SafetyAlertMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    severity: $Enums.AlertSeverity | null
    issuedBy: string | null
    isActive: boolean | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type SafetyAlertMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    severity: $Enums.AlertSeverity | null
    issuedBy: string | null
    isActive: boolean | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type SafetyAlertCountAggregateOutputType = {
    id: number
    title: number
    description: number
    severity: number
    affectedAreas: number
    issuedBy: number
    isActive: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type SafetyAlertMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    severity?: true
    issuedBy?: true
    isActive?: true
    createdAt?: true
    expiresAt?: true
  }

  export type SafetyAlertMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    severity?: true
    issuedBy?: true
    isActive?: true
    createdAt?: true
    expiresAt?: true
  }

  export type SafetyAlertCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    severity?: true
    affectedAreas?: true
    issuedBy?: true
    isActive?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type SafetyAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyAlert to aggregate.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SafetyAlerts
    **/
    _count?: true | SafetyAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SafetyAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SafetyAlertMaxAggregateInputType
  }

  export type GetSafetyAlertAggregateType<T extends SafetyAlertAggregateArgs> = {
        [P in keyof T & keyof AggregateSafetyAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSafetyAlert[P]>
      : GetScalarType<T[P], AggregateSafetyAlert[P]>
  }




  export type SafetyAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyAlertWhereInput
    orderBy?: SafetyAlertOrderByWithAggregationInput | SafetyAlertOrderByWithAggregationInput[]
    by: SafetyAlertScalarFieldEnum[] | SafetyAlertScalarFieldEnum
    having?: SafetyAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SafetyAlertCountAggregateInputType | true
    _min?: SafetyAlertMinAggregateInputType
    _max?: SafetyAlertMaxAggregateInputType
  }

  export type SafetyAlertGroupByOutputType = {
    id: string
    title: string
    description: string
    severity: $Enums.AlertSeverity
    affectedAreas: string[]
    issuedBy: string | null
    isActive: boolean
    createdAt: Date
    expiresAt: Date | null
    _count: SafetyAlertCountAggregateOutputType | null
    _min: SafetyAlertMinAggregateOutputType | null
    _max: SafetyAlertMaxAggregateOutputType | null
  }

  type GetSafetyAlertGroupByPayload<T extends SafetyAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SafetyAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SafetyAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SafetyAlertGroupByOutputType[P]>
            : GetScalarType<T[P], SafetyAlertGroupByOutputType[P]>
        }
      >
    >


  export type SafetyAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    severity?: boolean
    affectedAreas?: boolean
    issuedBy?: boolean
    isActive?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["safetyAlert"]>

  export type SafetyAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    severity?: boolean
    affectedAreas?: boolean
    issuedBy?: boolean
    isActive?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["safetyAlert"]>

  export type SafetyAlertSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    severity?: boolean
    affectedAreas?: boolean
    issuedBy?: boolean
    isActive?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }


  export type $SafetyAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyAlert"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      severity: $Enums.AlertSeverity
      affectedAreas: string[]
      issuedBy: string | null
      isActive: boolean
      createdAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["safetyAlert"]>
    composites: {}
  }

  type SafetyAlertGetPayload<S extends boolean | null | undefined | SafetyAlertDefaultArgs> = $Result.GetResult<Prisma.$SafetyAlertPayload, S>

  type SafetyAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SafetyAlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SafetyAlertCountAggregateInputType | true
    }

  export interface SafetyAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SafetyAlert'], meta: { name: 'SafetyAlert' } }
    /**
     * Find zero or one SafetyAlert that matches the filter.
     * @param {SafetyAlertFindUniqueArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SafetyAlertFindUniqueArgs>(args: SelectSubset<T, SafetyAlertFindUniqueArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SafetyAlert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SafetyAlertFindUniqueOrThrowArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SafetyAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, SafetyAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SafetyAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertFindFirstArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SafetyAlertFindFirstArgs>(args?: SelectSubset<T, SafetyAlertFindFirstArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SafetyAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertFindFirstOrThrowArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SafetyAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, SafetyAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SafetyAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SafetyAlerts
     * const safetyAlerts = await prisma.safetyAlert.findMany()
     * 
     * // Get first 10 SafetyAlerts
     * const safetyAlerts = await prisma.safetyAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const safetyAlertWithIdOnly = await prisma.safetyAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SafetyAlertFindManyArgs>(args?: SelectSubset<T, SafetyAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SafetyAlert.
     * @param {SafetyAlertCreateArgs} args - Arguments to create a SafetyAlert.
     * @example
     * // Create one SafetyAlert
     * const SafetyAlert = await prisma.safetyAlert.create({
     *   data: {
     *     // ... data to create a SafetyAlert
     *   }
     * })
     * 
     */
    create<T extends SafetyAlertCreateArgs>(args: SelectSubset<T, SafetyAlertCreateArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SafetyAlerts.
     * @param {SafetyAlertCreateManyArgs} args - Arguments to create many SafetyAlerts.
     * @example
     * // Create many SafetyAlerts
     * const safetyAlert = await prisma.safetyAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SafetyAlertCreateManyArgs>(args?: SelectSubset<T, SafetyAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SafetyAlerts and returns the data saved in the database.
     * @param {SafetyAlertCreateManyAndReturnArgs} args - Arguments to create many SafetyAlerts.
     * @example
     * // Create many SafetyAlerts
     * const safetyAlert = await prisma.safetyAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SafetyAlerts and only return the `id`
     * const safetyAlertWithIdOnly = await prisma.safetyAlert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SafetyAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, SafetyAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SafetyAlert.
     * @param {SafetyAlertDeleteArgs} args - Arguments to delete one SafetyAlert.
     * @example
     * // Delete one SafetyAlert
     * const SafetyAlert = await prisma.safetyAlert.delete({
     *   where: {
     *     // ... filter to delete one SafetyAlert
     *   }
     * })
     * 
     */
    delete<T extends SafetyAlertDeleteArgs>(args: SelectSubset<T, SafetyAlertDeleteArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SafetyAlert.
     * @param {SafetyAlertUpdateArgs} args - Arguments to update one SafetyAlert.
     * @example
     * // Update one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SafetyAlertUpdateArgs>(args: SelectSubset<T, SafetyAlertUpdateArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SafetyAlerts.
     * @param {SafetyAlertDeleteManyArgs} args - Arguments to filter SafetyAlerts to delete.
     * @example
     * // Delete a few SafetyAlerts
     * const { count } = await prisma.safetyAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SafetyAlertDeleteManyArgs>(args?: SelectSubset<T, SafetyAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SafetyAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SafetyAlerts
     * const safetyAlert = await prisma.safetyAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SafetyAlertUpdateManyArgs>(args: SelectSubset<T, SafetyAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SafetyAlert.
     * @param {SafetyAlertUpsertArgs} args - Arguments to update or create a SafetyAlert.
     * @example
     * // Update or create a SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.upsert({
     *   create: {
     *     // ... data to create a SafetyAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SafetyAlert we want to update
     *   }
     * })
     */
    upsert<T extends SafetyAlertUpsertArgs>(args: SelectSubset<T, SafetyAlertUpsertArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SafetyAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertCountArgs} args - Arguments to filter SafetyAlerts to count.
     * @example
     * // Count the number of SafetyAlerts
     * const count = await prisma.safetyAlert.count({
     *   where: {
     *     // ... the filter for the SafetyAlerts we want to count
     *   }
     * })
    **/
    count<T extends SafetyAlertCountArgs>(
      args?: Subset<T, SafetyAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SafetyAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SafetyAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SafetyAlertAggregateArgs>(args: Subset<T, SafetyAlertAggregateArgs>): Prisma.PrismaPromise<GetSafetyAlertAggregateType<T>>

    /**
     * Group by SafetyAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SafetyAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SafetyAlertGroupByArgs['orderBy'] }
        : { orderBy?: SafetyAlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SafetyAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SafetyAlert model
   */
  readonly fields: SafetyAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SafetyAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SafetyAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SafetyAlert model
   */ 
  interface SafetyAlertFieldRefs {
    readonly id: FieldRef<"SafetyAlert", 'String'>
    readonly title: FieldRef<"SafetyAlert", 'String'>
    readonly description: FieldRef<"SafetyAlert", 'String'>
    readonly severity: FieldRef<"SafetyAlert", 'AlertSeverity'>
    readonly affectedAreas: FieldRef<"SafetyAlert", 'String[]'>
    readonly issuedBy: FieldRef<"SafetyAlert", 'String'>
    readonly isActive: FieldRef<"SafetyAlert", 'Boolean'>
    readonly createdAt: FieldRef<"SafetyAlert", 'DateTime'>
    readonly expiresAt: FieldRef<"SafetyAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SafetyAlert findUnique
   */
  export type SafetyAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert findUniqueOrThrow
   */
  export type SafetyAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert findFirst
   */
  export type SafetyAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyAlerts.
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyAlerts.
     */
    distinct?: SafetyAlertScalarFieldEnum | SafetyAlertScalarFieldEnum[]
  }

  /**
   * SafetyAlert findFirstOrThrow
   */
  export type SafetyAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyAlerts.
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyAlerts.
     */
    distinct?: SafetyAlertScalarFieldEnum | SafetyAlertScalarFieldEnum[]
  }

  /**
   * SafetyAlert findMany
   */
  export type SafetyAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAlerts to fetch.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SafetyAlerts.
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    distinct?: SafetyAlertScalarFieldEnum | SafetyAlertScalarFieldEnum[]
  }

  /**
   * SafetyAlert create
   */
  export type SafetyAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * The data needed to create a SafetyAlert.
     */
    data: XOR<SafetyAlertCreateInput, SafetyAlertUncheckedCreateInput>
  }

  /**
   * SafetyAlert createMany
   */
  export type SafetyAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SafetyAlerts.
     */
    data: SafetyAlertCreateManyInput | SafetyAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyAlert createManyAndReturn
   */
  export type SafetyAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SafetyAlerts.
     */
    data: SafetyAlertCreateManyInput | SafetyAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyAlert update
   */
  export type SafetyAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * The data needed to update a SafetyAlert.
     */
    data: XOR<SafetyAlertUpdateInput, SafetyAlertUncheckedUpdateInput>
    /**
     * Choose, which SafetyAlert to update.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert updateMany
   */
  export type SafetyAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SafetyAlerts.
     */
    data: XOR<SafetyAlertUpdateManyMutationInput, SafetyAlertUncheckedUpdateManyInput>
    /**
     * Filter which SafetyAlerts to update
     */
    where?: SafetyAlertWhereInput
  }

  /**
   * SafetyAlert upsert
   */
  export type SafetyAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * The filter to search for the SafetyAlert to update in case it exists.
     */
    where: SafetyAlertWhereUniqueInput
    /**
     * In case the SafetyAlert found by the `where` argument doesn't exist, create a new SafetyAlert with this data.
     */
    create: XOR<SafetyAlertCreateInput, SafetyAlertUncheckedCreateInput>
    /**
     * In case the SafetyAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SafetyAlertUpdateInput, SafetyAlertUncheckedUpdateInput>
  }

  /**
   * SafetyAlert delete
   */
  export type SafetyAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Filter which SafetyAlert to delete.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert deleteMany
   */
  export type SafetyAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyAlerts to delete
     */
    where?: SafetyAlertWhereInput
  }

  /**
   * SafetyAlert without action
   */
  export type SafetyAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
  }


  /**
   * Model SafetyZone
   */

  export type AggregateSafetyZone = {
    _count: SafetyZoneCountAggregateOutputType | null
    _avg: SafetyZoneAvgAggregateOutputType | null
    _sum: SafetyZoneSumAggregateOutputType | null
    _min: SafetyZoneMinAggregateOutputType | null
    _max: SafetyZoneMaxAggregateOutputType | null
  }

  export type SafetyZoneAvgAggregateOutputType = {
    safetyScore: number | null
  }

  export type SafetyZoneSumAggregateOutputType = {
    safetyScore: number | null
  }

  export type SafetyZoneMinAggregateOutputType = {
    id: string | null
    areaName: string | null
    safetyScore: number | null
    zoneLevel: $Enums.ZoneLevel | null
    notes: string | null
    updatedAt: Date | null
  }

  export type SafetyZoneMaxAggregateOutputType = {
    id: string | null
    areaName: string | null
    safetyScore: number | null
    zoneLevel: $Enums.ZoneLevel | null
    notes: string | null
    updatedAt: Date | null
  }

  export type SafetyZoneCountAggregateOutputType = {
    id: number
    areaName: number
    safetyScore: number
    zoneLevel: number
    polygon: number
    notes: number
    updatedAt: number
    _all: number
  }


  export type SafetyZoneAvgAggregateInputType = {
    safetyScore?: true
  }

  export type SafetyZoneSumAggregateInputType = {
    safetyScore?: true
  }

  export type SafetyZoneMinAggregateInputType = {
    id?: true
    areaName?: true
    safetyScore?: true
    zoneLevel?: true
    notes?: true
    updatedAt?: true
  }

  export type SafetyZoneMaxAggregateInputType = {
    id?: true
    areaName?: true
    safetyScore?: true
    zoneLevel?: true
    notes?: true
    updatedAt?: true
  }

  export type SafetyZoneCountAggregateInputType = {
    id?: true
    areaName?: true
    safetyScore?: true
    zoneLevel?: true
    polygon?: true
    notes?: true
    updatedAt?: true
    _all?: true
  }

  export type SafetyZoneAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyZone to aggregate.
     */
    where?: SafetyZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyZones to fetch.
     */
    orderBy?: SafetyZoneOrderByWithRelationInput | SafetyZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SafetyZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SafetyZones
    **/
    _count?: true | SafetyZoneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SafetyZoneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SafetyZoneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SafetyZoneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SafetyZoneMaxAggregateInputType
  }

  export type GetSafetyZoneAggregateType<T extends SafetyZoneAggregateArgs> = {
        [P in keyof T & keyof AggregateSafetyZone]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSafetyZone[P]>
      : GetScalarType<T[P], AggregateSafetyZone[P]>
  }




  export type SafetyZoneGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyZoneWhereInput
    orderBy?: SafetyZoneOrderByWithAggregationInput | SafetyZoneOrderByWithAggregationInput[]
    by: SafetyZoneScalarFieldEnum[] | SafetyZoneScalarFieldEnum
    having?: SafetyZoneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SafetyZoneCountAggregateInputType | true
    _avg?: SafetyZoneAvgAggregateInputType
    _sum?: SafetyZoneSumAggregateInputType
    _min?: SafetyZoneMinAggregateInputType
    _max?: SafetyZoneMaxAggregateInputType
  }

  export type SafetyZoneGroupByOutputType = {
    id: string
    areaName: string
    safetyScore: number
    zoneLevel: $Enums.ZoneLevel
    polygon: JsonValue | null
    notes: string | null
    updatedAt: Date
    _count: SafetyZoneCountAggregateOutputType | null
    _avg: SafetyZoneAvgAggregateOutputType | null
    _sum: SafetyZoneSumAggregateOutputType | null
    _min: SafetyZoneMinAggregateOutputType | null
    _max: SafetyZoneMaxAggregateOutputType | null
  }

  type GetSafetyZoneGroupByPayload<T extends SafetyZoneGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SafetyZoneGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SafetyZoneGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SafetyZoneGroupByOutputType[P]>
            : GetScalarType<T[P], SafetyZoneGroupByOutputType[P]>
        }
      >
    >


  export type SafetyZoneSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    areaName?: boolean
    safetyScore?: boolean
    zoneLevel?: boolean
    polygon?: boolean
    notes?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyZone"]>

  export type SafetyZoneSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    areaName?: boolean
    safetyScore?: boolean
    zoneLevel?: boolean
    polygon?: boolean
    notes?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyZone"]>

  export type SafetyZoneSelectScalar = {
    id?: boolean
    areaName?: boolean
    safetyScore?: boolean
    zoneLevel?: boolean
    polygon?: boolean
    notes?: boolean
    updatedAt?: boolean
  }


  export type $SafetyZonePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyZone"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      areaName: string
      safetyScore: number
      zoneLevel: $Enums.ZoneLevel
      polygon: Prisma.JsonValue | null
      notes: string | null
      updatedAt: Date
    }, ExtArgs["result"]["safetyZone"]>
    composites: {}
  }

  type SafetyZoneGetPayload<S extends boolean | null | undefined | SafetyZoneDefaultArgs> = $Result.GetResult<Prisma.$SafetyZonePayload, S>

  type SafetyZoneCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SafetyZoneFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SafetyZoneCountAggregateInputType | true
    }

  export interface SafetyZoneDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SafetyZone'], meta: { name: 'SafetyZone' } }
    /**
     * Find zero or one SafetyZone that matches the filter.
     * @param {SafetyZoneFindUniqueArgs} args - Arguments to find a SafetyZone
     * @example
     * // Get one SafetyZone
     * const safetyZone = await prisma.safetyZone.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SafetyZoneFindUniqueArgs>(args: SelectSubset<T, SafetyZoneFindUniqueArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SafetyZone that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SafetyZoneFindUniqueOrThrowArgs} args - Arguments to find a SafetyZone
     * @example
     * // Get one SafetyZone
     * const safetyZone = await prisma.safetyZone.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SafetyZoneFindUniqueOrThrowArgs>(args: SelectSubset<T, SafetyZoneFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SafetyZone that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneFindFirstArgs} args - Arguments to find a SafetyZone
     * @example
     * // Get one SafetyZone
     * const safetyZone = await prisma.safetyZone.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SafetyZoneFindFirstArgs>(args?: SelectSubset<T, SafetyZoneFindFirstArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SafetyZone that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneFindFirstOrThrowArgs} args - Arguments to find a SafetyZone
     * @example
     * // Get one SafetyZone
     * const safetyZone = await prisma.safetyZone.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SafetyZoneFindFirstOrThrowArgs>(args?: SelectSubset<T, SafetyZoneFindFirstOrThrowArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SafetyZones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SafetyZones
     * const safetyZones = await prisma.safetyZone.findMany()
     * 
     * // Get first 10 SafetyZones
     * const safetyZones = await prisma.safetyZone.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const safetyZoneWithIdOnly = await prisma.safetyZone.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SafetyZoneFindManyArgs>(args?: SelectSubset<T, SafetyZoneFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SafetyZone.
     * @param {SafetyZoneCreateArgs} args - Arguments to create a SafetyZone.
     * @example
     * // Create one SafetyZone
     * const SafetyZone = await prisma.safetyZone.create({
     *   data: {
     *     // ... data to create a SafetyZone
     *   }
     * })
     * 
     */
    create<T extends SafetyZoneCreateArgs>(args: SelectSubset<T, SafetyZoneCreateArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SafetyZones.
     * @param {SafetyZoneCreateManyArgs} args - Arguments to create many SafetyZones.
     * @example
     * // Create many SafetyZones
     * const safetyZone = await prisma.safetyZone.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SafetyZoneCreateManyArgs>(args?: SelectSubset<T, SafetyZoneCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SafetyZones and returns the data saved in the database.
     * @param {SafetyZoneCreateManyAndReturnArgs} args - Arguments to create many SafetyZones.
     * @example
     * // Create many SafetyZones
     * const safetyZone = await prisma.safetyZone.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SafetyZones and only return the `id`
     * const safetyZoneWithIdOnly = await prisma.safetyZone.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SafetyZoneCreateManyAndReturnArgs>(args?: SelectSubset<T, SafetyZoneCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SafetyZone.
     * @param {SafetyZoneDeleteArgs} args - Arguments to delete one SafetyZone.
     * @example
     * // Delete one SafetyZone
     * const SafetyZone = await prisma.safetyZone.delete({
     *   where: {
     *     // ... filter to delete one SafetyZone
     *   }
     * })
     * 
     */
    delete<T extends SafetyZoneDeleteArgs>(args: SelectSubset<T, SafetyZoneDeleteArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SafetyZone.
     * @param {SafetyZoneUpdateArgs} args - Arguments to update one SafetyZone.
     * @example
     * // Update one SafetyZone
     * const safetyZone = await prisma.safetyZone.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SafetyZoneUpdateArgs>(args: SelectSubset<T, SafetyZoneUpdateArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SafetyZones.
     * @param {SafetyZoneDeleteManyArgs} args - Arguments to filter SafetyZones to delete.
     * @example
     * // Delete a few SafetyZones
     * const { count } = await prisma.safetyZone.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SafetyZoneDeleteManyArgs>(args?: SelectSubset<T, SafetyZoneDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SafetyZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SafetyZones
     * const safetyZone = await prisma.safetyZone.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SafetyZoneUpdateManyArgs>(args: SelectSubset<T, SafetyZoneUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SafetyZone.
     * @param {SafetyZoneUpsertArgs} args - Arguments to update or create a SafetyZone.
     * @example
     * // Update or create a SafetyZone
     * const safetyZone = await prisma.safetyZone.upsert({
     *   create: {
     *     // ... data to create a SafetyZone
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SafetyZone we want to update
     *   }
     * })
     */
    upsert<T extends SafetyZoneUpsertArgs>(args: SelectSubset<T, SafetyZoneUpsertArgs<ExtArgs>>): Prisma__SafetyZoneClient<$Result.GetResult<Prisma.$SafetyZonePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SafetyZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneCountArgs} args - Arguments to filter SafetyZones to count.
     * @example
     * // Count the number of SafetyZones
     * const count = await prisma.safetyZone.count({
     *   where: {
     *     // ... the filter for the SafetyZones we want to count
     *   }
     * })
    **/
    count<T extends SafetyZoneCountArgs>(
      args?: Subset<T, SafetyZoneCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SafetyZoneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SafetyZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SafetyZoneAggregateArgs>(args: Subset<T, SafetyZoneAggregateArgs>): Prisma.PrismaPromise<GetSafetyZoneAggregateType<T>>

    /**
     * Group by SafetyZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyZoneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SafetyZoneGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SafetyZoneGroupByArgs['orderBy'] }
        : { orderBy?: SafetyZoneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SafetyZoneGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyZoneGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SafetyZone model
   */
  readonly fields: SafetyZoneFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SafetyZone.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SafetyZoneClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SafetyZone model
   */ 
  interface SafetyZoneFieldRefs {
    readonly id: FieldRef<"SafetyZone", 'String'>
    readonly areaName: FieldRef<"SafetyZone", 'String'>
    readonly safetyScore: FieldRef<"SafetyZone", 'Float'>
    readonly zoneLevel: FieldRef<"SafetyZone", 'ZoneLevel'>
    readonly polygon: FieldRef<"SafetyZone", 'Json'>
    readonly notes: FieldRef<"SafetyZone", 'String'>
    readonly updatedAt: FieldRef<"SafetyZone", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SafetyZone findUnique
   */
  export type SafetyZoneFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * Filter, which SafetyZone to fetch.
     */
    where: SafetyZoneWhereUniqueInput
  }

  /**
   * SafetyZone findUniqueOrThrow
   */
  export type SafetyZoneFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * Filter, which SafetyZone to fetch.
     */
    where: SafetyZoneWhereUniqueInput
  }

  /**
   * SafetyZone findFirst
   */
  export type SafetyZoneFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * Filter, which SafetyZone to fetch.
     */
    where?: SafetyZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyZones to fetch.
     */
    orderBy?: SafetyZoneOrderByWithRelationInput | SafetyZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyZones.
     */
    cursor?: SafetyZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyZones.
     */
    distinct?: SafetyZoneScalarFieldEnum | SafetyZoneScalarFieldEnum[]
  }

  /**
   * SafetyZone findFirstOrThrow
   */
  export type SafetyZoneFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * Filter, which SafetyZone to fetch.
     */
    where?: SafetyZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyZones to fetch.
     */
    orderBy?: SafetyZoneOrderByWithRelationInput | SafetyZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyZones.
     */
    cursor?: SafetyZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyZones.
     */
    distinct?: SafetyZoneScalarFieldEnum | SafetyZoneScalarFieldEnum[]
  }

  /**
   * SafetyZone findMany
   */
  export type SafetyZoneFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * Filter, which SafetyZones to fetch.
     */
    where?: SafetyZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyZones to fetch.
     */
    orderBy?: SafetyZoneOrderByWithRelationInput | SafetyZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SafetyZones.
     */
    cursor?: SafetyZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyZones.
     */
    skip?: number
    distinct?: SafetyZoneScalarFieldEnum | SafetyZoneScalarFieldEnum[]
  }

  /**
   * SafetyZone create
   */
  export type SafetyZoneCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * The data needed to create a SafetyZone.
     */
    data: XOR<SafetyZoneCreateInput, SafetyZoneUncheckedCreateInput>
  }

  /**
   * SafetyZone createMany
   */
  export type SafetyZoneCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SafetyZones.
     */
    data: SafetyZoneCreateManyInput | SafetyZoneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyZone createManyAndReturn
   */
  export type SafetyZoneCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SafetyZones.
     */
    data: SafetyZoneCreateManyInput | SafetyZoneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyZone update
   */
  export type SafetyZoneUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * The data needed to update a SafetyZone.
     */
    data: XOR<SafetyZoneUpdateInput, SafetyZoneUncheckedUpdateInput>
    /**
     * Choose, which SafetyZone to update.
     */
    where: SafetyZoneWhereUniqueInput
  }

  /**
   * SafetyZone updateMany
   */
  export type SafetyZoneUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SafetyZones.
     */
    data: XOR<SafetyZoneUpdateManyMutationInput, SafetyZoneUncheckedUpdateManyInput>
    /**
     * Filter which SafetyZones to update
     */
    where?: SafetyZoneWhereInput
  }

  /**
   * SafetyZone upsert
   */
  export type SafetyZoneUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * The filter to search for the SafetyZone to update in case it exists.
     */
    where: SafetyZoneWhereUniqueInput
    /**
     * In case the SafetyZone found by the `where` argument doesn't exist, create a new SafetyZone with this data.
     */
    create: XOR<SafetyZoneCreateInput, SafetyZoneUncheckedCreateInput>
    /**
     * In case the SafetyZone was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SafetyZoneUpdateInput, SafetyZoneUncheckedUpdateInput>
  }

  /**
   * SafetyZone delete
   */
  export type SafetyZoneDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
    /**
     * Filter which SafetyZone to delete.
     */
    where: SafetyZoneWhereUniqueInput
  }

  /**
   * SafetyZone deleteMany
   */
  export type SafetyZoneDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyZones to delete
     */
    where?: SafetyZoneWhereInput
  }

  /**
   * SafetyZone without action
   */
  export type SafetyZoneDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyZone
     */
    select?: SafetyZoneSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    password: 'password',
    role: 'role',
    avatar: 'avatar',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LocationLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    latitude: 'latitude',
    longitude: 'longitude',
    accuracy: 'accuracy',
    speed: 'speed',
    heading: 'heading',
    riskScore: 'riskScore',
    source: 'source',
    timestamp: 'timestamp'
  };

  export type LocationLogScalarFieldEnum = (typeof LocationLogScalarFieldEnum)[keyof typeof LocationLogScalarFieldEnum]


  export const EmergencyContactScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    phone: 'phone',
    email: 'email',
    relation: 'relation'
  };

  export type EmergencyContactScalarFieldEnum = (typeof EmergencyContactScalarFieldEnum)[keyof typeof EmergencyContactScalarFieldEnum]


  export const ItineraryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    startLocation: 'startLocation',
    endLocation: 'endLocation',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    checklist: 'checklist'
  };

  export type ItineraryScalarFieldEnum = (typeof ItineraryScalarFieldEnum)[keyof typeof ItineraryScalarFieldEnum]


  export const BookingPartnerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    url: 'url',
    logoUrl: 'logoUrl',
    category: 'category',
    isVerified: 'isVerified',
    isActive: 'isActive',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookingPartnerScalarFieldEnum = (typeof BookingPartnerScalarFieldEnum)[keyof typeof BookingPartnerScalarFieldEnum]


  export const BookingVisitScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    partnerId: 'partnerId',
    durationMs: 'durationMs',
    visitedAt: 'visitedAt'
  };

  export type BookingVisitScalarFieldEnum = (typeof BookingVisitScalarFieldEnum)[keyof typeof BookingVisitScalarFieldEnum]


  export const SOSAlertScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    latitude: 'latitude',
    longitude: 'longitude',
    address: 'address',
    emergencyContacts: 'emergencyContacts',
    resolvedAt: 'resolvedAt',
    cancelledAt: 'cancelledAt',
    acknowledgedAt: 'acknowledgedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SOSAlertScalarFieldEnum = (typeof SOSAlertScalarFieldEnum)[keyof typeof SOSAlertScalarFieldEnum]


  export const SupportTicketScalarFieldEnum: {
    id: 'id',
    ticketNumber: 'ticketNumber',
    userId: 'userId',
    name: 'name',
    email: 'email',
    subject: 'subject',
    message: 'message',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupportTicketScalarFieldEnum = (typeof SupportTicketScalarFieldEnum)[keyof typeof SupportTicketScalarFieldEnum]


  export const SafetyAlertScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    severity: 'severity',
    affectedAreas: 'affectedAreas',
    issuedBy: 'issuedBy',
    isActive: 'isActive',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type SafetyAlertScalarFieldEnum = (typeof SafetyAlertScalarFieldEnum)[keyof typeof SafetyAlertScalarFieldEnum]


  export const SafetyZoneScalarFieldEnum: {
    id: 'id',
    areaName: 'areaName',
    safetyScore: 'safetyScore',
    zoneLevel: 'zoneLevel',
    polygon: 'polygon',
    notes: 'notes',
    updatedAt: 'updatedAt'
  };

  export type SafetyZoneScalarFieldEnum = (typeof SafetyZoneScalarFieldEnum)[keyof typeof SafetyZoneScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'LocationSource'
   */
  export type EnumLocationSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocationSource'>
    


  /**
   * Reference to a field of type 'LocationSource[]'
   */
  export type ListEnumLocationSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocationSource[]'>
    


  /**
   * Reference to a field of type 'ItineraryStatus'
   */
  export type EnumItineraryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItineraryStatus'>
    


  /**
   * Reference to a field of type 'ItineraryStatus[]'
   */
  export type ListEnumItineraryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItineraryStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'SOSStatus'
   */
  export type EnumSOSStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SOSStatus'>
    


  /**
   * Reference to a field of type 'SOSStatus[]'
   */
  export type ListEnumSOSStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SOSStatus[]'>
    


  /**
   * Reference to a field of type 'TicketStatus'
   */
  export type EnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus'>
    


  /**
   * Reference to a field of type 'TicketStatus[]'
   */
  export type ListEnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus[]'>
    


  /**
   * Reference to a field of type 'AlertSeverity'
   */
  export type EnumAlertSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertSeverity'>
    


  /**
   * Reference to a field of type 'AlertSeverity[]'
   */
  export type ListEnumAlertSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertSeverity[]'>
    


  /**
   * Reference to a field of type 'ZoneLevel'
   */
  export type EnumZoneLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ZoneLevel'>
    


  /**
   * Reference to a field of type 'ZoneLevel[]'
   */
  export type ListEnumZoneLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ZoneLevel[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    locationLogs?: LocationLogListRelationFilter
    emergencyContacts?: EmergencyContactListRelationFilter
    itineraries?: ItineraryListRelationFilter
    bookingVisits?: BookingVisitListRelationFilter
    supportTickets?: SupportTicketListRelationFilter
    sosAlerts?: SOSAlertListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locationLogs?: LocationLogOrderByRelationAggregateInput
    emergencyContacts?: EmergencyContactOrderByRelationAggregateInput
    itineraries?: ItineraryOrderByRelationAggregateInput
    bookingVisits?: BookingVisitOrderByRelationAggregateInput
    supportTickets?: SupportTicketOrderByRelationAggregateInput
    sosAlerts?: SOSAlertOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    locationLogs?: LocationLogListRelationFilter
    emergencyContacts?: EmergencyContactListRelationFilter
    itineraries?: ItineraryListRelationFilter
    bookingVisits?: BookingVisitListRelationFilter
    supportTickets?: SupportTicketListRelationFilter
    sosAlerts?: SOSAlertListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type LocationLogWhereInput = {
    AND?: LocationLogWhereInput | LocationLogWhereInput[]
    OR?: LocationLogWhereInput[]
    NOT?: LocationLogWhereInput | LocationLogWhereInput[]
    id?: StringFilter<"LocationLog"> | string
    userId?: StringFilter<"LocationLog"> | string
    latitude?: FloatFilter<"LocationLog"> | number
    longitude?: FloatFilter<"LocationLog"> | number
    accuracy?: FloatNullableFilter<"LocationLog"> | number | null
    speed?: FloatNullableFilter<"LocationLog"> | number | null
    heading?: FloatNullableFilter<"LocationLog"> | number | null
    riskScore?: IntFilter<"LocationLog"> | number
    source?: EnumLocationSourceFilter<"LocationLog"> | $Enums.LocationSource
    timestamp?: DateTimeFilter<"LocationLog"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type LocationLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    speed?: SortOrderInput | SortOrder
    heading?: SortOrderInput | SortOrder
    riskScore?: SortOrder
    source?: SortOrder
    timestamp?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type LocationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocationLogWhereInput | LocationLogWhereInput[]
    OR?: LocationLogWhereInput[]
    NOT?: LocationLogWhereInput | LocationLogWhereInput[]
    userId?: StringFilter<"LocationLog"> | string
    latitude?: FloatFilter<"LocationLog"> | number
    longitude?: FloatFilter<"LocationLog"> | number
    accuracy?: FloatNullableFilter<"LocationLog"> | number | null
    speed?: FloatNullableFilter<"LocationLog"> | number | null
    heading?: FloatNullableFilter<"LocationLog"> | number | null
    riskScore?: IntFilter<"LocationLog"> | number
    source?: EnumLocationSourceFilter<"LocationLog"> | $Enums.LocationSource
    timestamp?: DateTimeFilter<"LocationLog"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type LocationLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    speed?: SortOrderInput | SortOrder
    heading?: SortOrderInput | SortOrder
    riskScore?: SortOrder
    source?: SortOrder
    timestamp?: SortOrder
    _count?: LocationLogCountOrderByAggregateInput
    _avg?: LocationLogAvgOrderByAggregateInput
    _max?: LocationLogMaxOrderByAggregateInput
    _min?: LocationLogMinOrderByAggregateInput
    _sum?: LocationLogSumOrderByAggregateInput
  }

  export type LocationLogScalarWhereWithAggregatesInput = {
    AND?: LocationLogScalarWhereWithAggregatesInput | LocationLogScalarWhereWithAggregatesInput[]
    OR?: LocationLogScalarWhereWithAggregatesInput[]
    NOT?: LocationLogScalarWhereWithAggregatesInput | LocationLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocationLog"> | string
    userId?: StringWithAggregatesFilter<"LocationLog"> | string
    latitude?: FloatWithAggregatesFilter<"LocationLog"> | number
    longitude?: FloatWithAggregatesFilter<"LocationLog"> | number
    accuracy?: FloatNullableWithAggregatesFilter<"LocationLog"> | number | null
    speed?: FloatNullableWithAggregatesFilter<"LocationLog"> | number | null
    heading?: FloatNullableWithAggregatesFilter<"LocationLog"> | number | null
    riskScore?: IntWithAggregatesFilter<"LocationLog"> | number
    source?: EnumLocationSourceWithAggregatesFilter<"LocationLog"> | $Enums.LocationSource
    timestamp?: DateTimeWithAggregatesFilter<"LocationLog"> | Date | string
  }

  export type EmergencyContactWhereInput = {
    AND?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    OR?: EmergencyContactWhereInput[]
    NOT?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    id?: StringFilter<"EmergencyContact"> | string
    userId?: StringFilter<"EmergencyContact"> | string
    name?: StringFilter<"EmergencyContact"> | string
    phone?: StringFilter<"EmergencyContact"> | string
    email?: StringNullableFilter<"EmergencyContact"> | string | null
    relation?: StringFilter<"EmergencyContact"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type EmergencyContactOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    relation?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type EmergencyContactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    OR?: EmergencyContactWhereInput[]
    NOT?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    userId?: StringFilter<"EmergencyContact"> | string
    name?: StringFilter<"EmergencyContact"> | string
    phone?: StringFilter<"EmergencyContact"> | string
    email?: StringNullableFilter<"EmergencyContact"> | string | null
    relation?: StringFilter<"EmergencyContact"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type EmergencyContactOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    relation?: SortOrder
    _count?: EmergencyContactCountOrderByAggregateInput
    _max?: EmergencyContactMaxOrderByAggregateInput
    _min?: EmergencyContactMinOrderByAggregateInput
  }

  export type EmergencyContactScalarWhereWithAggregatesInput = {
    AND?: EmergencyContactScalarWhereWithAggregatesInput | EmergencyContactScalarWhereWithAggregatesInput[]
    OR?: EmergencyContactScalarWhereWithAggregatesInput[]
    NOT?: EmergencyContactScalarWhereWithAggregatesInput | EmergencyContactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmergencyContact"> | string
    userId?: StringWithAggregatesFilter<"EmergencyContact"> | string
    name?: StringWithAggregatesFilter<"EmergencyContact"> | string
    phone?: StringWithAggregatesFilter<"EmergencyContact"> | string
    email?: StringNullableWithAggregatesFilter<"EmergencyContact"> | string | null
    relation?: StringWithAggregatesFilter<"EmergencyContact"> | string
  }

  export type ItineraryWhereInput = {
    AND?: ItineraryWhereInput | ItineraryWhereInput[]
    OR?: ItineraryWhereInput[]
    NOT?: ItineraryWhereInput | ItineraryWhereInput[]
    id?: StringFilter<"Itinerary"> | string
    userId?: StringFilter<"Itinerary"> | string
    startLocation?: StringFilter<"Itinerary"> | string
    endLocation?: StringFilter<"Itinerary"> | string
    startTime?: DateTimeFilter<"Itinerary"> | Date | string
    endTime?: DateTimeFilter<"Itinerary"> | Date | string
    status?: EnumItineraryStatusFilter<"Itinerary"> | $Enums.ItineraryStatus
    checklist?: JsonNullableFilter<"Itinerary">
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ItineraryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    startLocation?: SortOrder
    endLocation?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    checklist?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ItineraryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ItineraryWhereInput | ItineraryWhereInput[]
    OR?: ItineraryWhereInput[]
    NOT?: ItineraryWhereInput | ItineraryWhereInput[]
    userId?: StringFilter<"Itinerary"> | string
    startLocation?: StringFilter<"Itinerary"> | string
    endLocation?: StringFilter<"Itinerary"> | string
    startTime?: DateTimeFilter<"Itinerary"> | Date | string
    endTime?: DateTimeFilter<"Itinerary"> | Date | string
    status?: EnumItineraryStatusFilter<"Itinerary"> | $Enums.ItineraryStatus
    checklist?: JsonNullableFilter<"Itinerary">
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ItineraryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    startLocation?: SortOrder
    endLocation?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    checklist?: SortOrderInput | SortOrder
    _count?: ItineraryCountOrderByAggregateInput
    _max?: ItineraryMaxOrderByAggregateInput
    _min?: ItineraryMinOrderByAggregateInput
  }

  export type ItineraryScalarWhereWithAggregatesInput = {
    AND?: ItineraryScalarWhereWithAggregatesInput | ItineraryScalarWhereWithAggregatesInput[]
    OR?: ItineraryScalarWhereWithAggregatesInput[]
    NOT?: ItineraryScalarWhereWithAggregatesInput | ItineraryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Itinerary"> | string
    userId?: StringWithAggregatesFilter<"Itinerary"> | string
    startLocation?: StringWithAggregatesFilter<"Itinerary"> | string
    endLocation?: StringWithAggregatesFilter<"Itinerary"> | string
    startTime?: DateTimeWithAggregatesFilter<"Itinerary"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Itinerary"> | Date | string
    status?: EnumItineraryStatusWithAggregatesFilter<"Itinerary"> | $Enums.ItineraryStatus
    checklist?: JsonNullableWithAggregatesFilter<"Itinerary">
  }

  export type BookingPartnerWhereInput = {
    AND?: BookingPartnerWhereInput | BookingPartnerWhereInput[]
    OR?: BookingPartnerWhereInput[]
    NOT?: BookingPartnerWhereInput | BookingPartnerWhereInput[]
    id?: StringFilter<"BookingPartner"> | string
    name?: StringFilter<"BookingPartner"> | string
    description?: StringFilter<"BookingPartner"> | string
    url?: StringFilter<"BookingPartner"> | string
    logoUrl?: StringNullableFilter<"BookingPartner"> | string | null
    category?: StringFilter<"BookingPartner"> | string
    isVerified?: BoolFilter<"BookingPartner"> | boolean
    isActive?: BoolFilter<"BookingPartner"> | boolean
    priority?: IntFilter<"BookingPartner"> | number
    createdAt?: DateTimeFilter<"BookingPartner"> | Date | string
    updatedAt?: DateTimeFilter<"BookingPartner"> | Date | string
    visits?: BookingVisitListRelationFilter
  }

  export type BookingPartnerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    visits?: BookingVisitOrderByRelationAggregateInput
  }

  export type BookingPartnerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingPartnerWhereInput | BookingPartnerWhereInput[]
    OR?: BookingPartnerWhereInput[]
    NOT?: BookingPartnerWhereInput | BookingPartnerWhereInput[]
    name?: StringFilter<"BookingPartner"> | string
    description?: StringFilter<"BookingPartner"> | string
    url?: StringFilter<"BookingPartner"> | string
    logoUrl?: StringNullableFilter<"BookingPartner"> | string | null
    category?: StringFilter<"BookingPartner"> | string
    isVerified?: BoolFilter<"BookingPartner"> | boolean
    isActive?: BoolFilter<"BookingPartner"> | boolean
    priority?: IntFilter<"BookingPartner"> | number
    createdAt?: DateTimeFilter<"BookingPartner"> | Date | string
    updatedAt?: DateTimeFilter<"BookingPartner"> | Date | string
    visits?: BookingVisitListRelationFilter
  }, "id">

  export type BookingPartnerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookingPartnerCountOrderByAggregateInput
    _avg?: BookingPartnerAvgOrderByAggregateInput
    _max?: BookingPartnerMaxOrderByAggregateInput
    _min?: BookingPartnerMinOrderByAggregateInput
    _sum?: BookingPartnerSumOrderByAggregateInput
  }

  export type BookingPartnerScalarWhereWithAggregatesInput = {
    AND?: BookingPartnerScalarWhereWithAggregatesInput | BookingPartnerScalarWhereWithAggregatesInput[]
    OR?: BookingPartnerScalarWhereWithAggregatesInput[]
    NOT?: BookingPartnerScalarWhereWithAggregatesInput | BookingPartnerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookingPartner"> | string
    name?: StringWithAggregatesFilter<"BookingPartner"> | string
    description?: StringWithAggregatesFilter<"BookingPartner"> | string
    url?: StringWithAggregatesFilter<"BookingPartner"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"BookingPartner"> | string | null
    category?: StringWithAggregatesFilter<"BookingPartner"> | string
    isVerified?: BoolWithAggregatesFilter<"BookingPartner"> | boolean
    isActive?: BoolWithAggregatesFilter<"BookingPartner"> | boolean
    priority?: IntWithAggregatesFilter<"BookingPartner"> | number
    createdAt?: DateTimeWithAggregatesFilter<"BookingPartner"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BookingPartner"> | Date | string
  }

  export type BookingVisitWhereInput = {
    AND?: BookingVisitWhereInput | BookingVisitWhereInput[]
    OR?: BookingVisitWhereInput[]
    NOT?: BookingVisitWhereInput | BookingVisitWhereInput[]
    id?: StringFilter<"BookingVisit"> | string
    userId?: StringFilter<"BookingVisit"> | string
    partnerId?: StringFilter<"BookingVisit"> | string
    durationMs?: IntFilter<"BookingVisit"> | number
    visitedAt?: DateTimeFilter<"BookingVisit"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    partner?: XOR<BookingPartnerRelationFilter, BookingPartnerWhereInput>
  }

  export type BookingVisitOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    partnerId?: SortOrder
    durationMs?: SortOrder
    visitedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    partner?: BookingPartnerOrderByWithRelationInput
  }

  export type BookingVisitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingVisitWhereInput | BookingVisitWhereInput[]
    OR?: BookingVisitWhereInput[]
    NOT?: BookingVisitWhereInput | BookingVisitWhereInput[]
    userId?: StringFilter<"BookingVisit"> | string
    partnerId?: StringFilter<"BookingVisit"> | string
    durationMs?: IntFilter<"BookingVisit"> | number
    visitedAt?: DateTimeFilter<"BookingVisit"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    partner?: XOR<BookingPartnerRelationFilter, BookingPartnerWhereInput>
  }, "id">

  export type BookingVisitOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    partnerId?: SortOrder
    durationMs?: SortOrder
    visitedAt?: SortOrder
    _count?: BookingVisitCountOrderByAggregateInput
    _avg?: BookingVisitAvgOrderByAggregateInput
    _max?: BookingVisitMaxOrderByAggregateInput
    _min?: BookingVisitMinOrderByAggregateInput
    _sum?: BookingVisitSumOrderByAggregateInput
  }

  export type BookingVisitScalarWhereWithAggregatesInput = {
    AND?: BookingVisitScalarWhereWithAggregatesInput | BookingVisitScalarWhereWithAggregatesInput[]
    OR?: BookingVisitScalarWhereWithAggregatesInput[]
    NOT?: BookingVisitScalarWhereWithAggregatesInput | BookingVisitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookingVisit"> | string
    userId?: StringWithAggregatesFilter<"BookingVisit"> | string
    partnerId?: StringWithAggregatesFilter<"BookingVisit"> | string
    durationMs?: IntWithAggregatesFilter<"BookingVisit"> | number
    visitedAt?: DateTimeWithAggregatesFilter<"BookingVisit"> | Date | string
  }

  export type SOSAlertWhereInput = {
    AND?: SOSAlertWhereInput | SOSAlertWhereInput[]
    OR?: SOSAlertWhereInput[]
    NOT?: SOSAlertWhereInput | SOSAlertWhereInput[]
    id?: StringFilter<"SOSAlert"> | string
    userId?: StringFilter<"SOSAlert"> | string
    status?: EnumSOSStatusFilter<"SOSAlert"> | $Enums.SOSStatus
    latitude?: FloatNullableFilter<"SOSAlert"> | number | null
    longitude?: FloatNullableFilter<"SOSAlert"> | number | null
    address?: StringNullableFilter<"SOSAlert"> | string | null
    emergencyContacts?: JsonNullableFilter<"SOSAlert">
    resolvedAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    acknowledgedAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"SOSAlert"> | Date | string
    updatedAt?: DateTimeFilter<"SOSAlert"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SOSAlertOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    emergencyContacts?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SOSAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SOSAlertWhereInput | SOSAlertWhereInput[]
    OR?: SOSAlertWhereInput[]
    NOT?: SOSAlertWhereInput | SOSAlertWhereInput[]
    userId?: StringFilter<"SOSAlert"> | string
    status?: EnumSOSStatusFilter<"SOSAlert"> | $Enums.SOSStatus
    latitude?: FloatNullableFilter<"SOSAlert"> | number | null
    longitude?: FloatNullableFilter<"SOSAlert"> | number | null
    address?: StringNullableFilter<"SOSAlert"> | string | null
    emergencyContacts?: JsonNullableFilter<"SOSAlert">
    resolvedAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    acknowledgedAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"SOSAlert"> | Date | string
    updatedAt?: DateTimeFilter<"SOSAlert"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type SOSAlertOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    emergencyContacts?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SOSAlertCountOrderByAggregateInput
    _avg?: SOSAlertAvgOrderByAggregateInput
    _max?: SOSAlertMaxOrderByAggregateInput
    _min?: SOSAlertMinOrderByAggregateInput
    _sum?: SOSAlertSumOrderByAggregateInput
  }

  export type SOSAlertScalarWhereWithAggregatesInput = {
    AND?: SOSAlertScalarWhereWithAggregatesInput | SOSAlertScalarWhereWithAggregatesInput[]
    OR?: SOSAlertScalarWhereWithAggregatesInput[]
    NOT?: SOSAlertScalarWhereWithAggregatesInput | SOSAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SOSAlert"> | string
    userId?: StringWithAggregatesFilter<"SOSAlert"> | string
    status?: EnumSOSStatusWithAggregatesFilter<"SOSAlert"> | $Enums.SOSStatus
    latitude?: FloatNullableWithAggregatesFilter<"SOSAlert"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"SOSAlert"> | number | null
    address?: StringNullableWithAggregatesFilter<"SOSAlert"> | string | null
    emergencyContacts?: JsonNullableWithAggregatesFilter<"SOSAlert">
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"SOSAlert"> | Date | string | null
    cancelledAt?: DateTimeNullableWithAggregatesFilter<"SOSAlert"> | Date | string | null
    acknowledgedAt?: DateTimeNullableWithAggregatesFilter<"SOSAlert"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SOSAlert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SOSAlert"> | Date | string
  }

  export type SupportTicketWhereInput = {
    AND?: SupportTicketWhereInput | SupportTicketWhereInput[]
    OR?: SupportTicketWhereInput[]
    NOT?: SupportTicketWhereInput | SupportTicketWhereInput[]
    id?: StringFilter<"SupportTicket"> | string
    ticketNumber?: IntFilter<"SupportTicket"> | number
    userId?: StringNullableFilter<"SupportTicket"> | string | null
    name?: StringFilter<"SupportTicket"> | string
    email?: StringFilter<"SupportTicket"> | string
    subject?: StringFilter<"SupportTicket"> | string
    message?: StringFilter<"SupportTicket"> | string
    status?: EnumTicketStatusFilter<"SupportTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeFilter<"SupportTicket"> | Date | string
    updatedAt?: DateTimeFilter<"SupportTicket"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type SupportTicketOrderByWithRelationInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SupportTicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ticketNumber?: number
    AND?: SupportTicketWhereInput | SupportTicketWhereInput[]
    OR?: SupportTicketWhereInput[]
    NOT?: SupportTicketWhereInput | SupportTicketWhereInput[]
    userId?: StringNullableFilter<"SupportTicket"> | string | null
    name?: StringFilter<"SupportTicket"> | string
    email?: StringFilter<"SupportTicket"> | string
    subject?: StringFilter<"SupportTicket"> | string
    message?: StringFilter<"SupportTicket"> | string
    status?: EnumTicketStatusFilter<"SupportTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeFilter<"SupportTicket"> | Date | string
    updatedAt?: DateTimeFilter<"SupportTicket"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "ticketNumber">

  export type SupportTicketOrderByWithAggregationInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupportTicketCountOrderByAggregateInput
    _avg?: SupportTicketAvgOrderByAggregateInput
    _max?: SupportTicketMaxOrderByAggregateInput
    _min?: SupportTicketMinOrderByAggregateInput
    _sum?: SupportTicketSumOrderByAggregateInput
  }

  export type SupportTicketScalarWhereWithAggregatesInput = {
    AND?: SupportTicketScalarWhereWithAggregatesInput | SupportTicketScalarWhereWithAggregatesInput[]
    OR?: SupportTicketScalarWhereWithAggregatesInput[]
    NOT?: SupportTicketScalarWhereWithAggregatesInput | SupportTicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SupportTicket"> | string
    ticketNumber?: IntWithAggregatesFilter<"SupportTicket"> | number
    userId?: StringNullableWithAggregatesFilter<"SupportTicket"> | string | null
    name?: StringWithAggregatesFilter<"SupportTicket"> | string
    email?: StringWithAggregatesFilter<"SupportTicket"> | string
    subject?: StringWithAggregatesFilter<"SupportTicket"> | string
    message?: StringWithAggregatesFilter<"SupportTicket"> | string
    status?: EnumTicketStatusWithAggregatesFilter<"SupportTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeWithAggregatesFilter<"SupportTicket"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupportTicket"> | Date | string
  }

  export type SafetyAlertWhereInput = {
    AND?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    OR?: SafetyAlertWhereInput[]
    NOT?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    id?: StringFilter<"SafetyAlert"> | string
    title?: StringFilter<"SafetyAlert"> | string
    description?: StringFilter<"SafetyAlert"> | string
    severity?: EnumAlertSeverityFilter<"SafetyAlert"> | $Enums.AlertSeverity
    affectedAreas?: StringNullableListFilter<"SafetyAlert">
    issuedBy?: StringNullableFilter<"SafetyAlert"> | string | null
    isActive?: BoolFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    expiresAt?: DateTimeNullableFilter<"SafetyAlert"> | Date | string | null
  }

  export type SafetyAlertOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    severity?: SortOrder
    affectedAreas?: SortOrder
    issuedBy?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
  }

  export type SafetyAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    OR?: SafetyAlertWhereInput[]
    NOT?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    title?: StringFilter<"SafetyAlert"> | string
    description?: StringFilter<"SafetyAlert"> | string
    severity?: EnumAlertSeverityFilter<"SafetyAlert"> | $Enums.AlertSeverity
    affectedAreas?: StringNullableListFilter<"SafetyAlert">
    issuedBy?: StringNullableFilter<"SafetyAlert"> | string | null
    isActive?: BoolFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    expiresAt?: DateTimeNullableFilter<"SafetyAlert"> | Date | string | null
  }, "id">

  export type SafetyAlertOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    severity?: SortOrder
    affectedAreas?: SortOrder
    issuedBy?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: SafetyAlertCountOrderByAggregateInput
    _max?: SafetyAlertMaxOrderByAggregateInput
    _min?: SafetyAlertMinOrderByAggregateInput
  }

  export type SafetyAlertScalarWhereWithAggregatesInput = {
    AND?: SafetyAlertScalarWhereWithAggregatesInput | SafetyAlertScalarWhereWithAggregatesInput[]
    OR?: SafetyAlertScalarWhereWithAggregatesInput[]
    NOT?: SafetyAlertScalarWhereWithAggregatesInput | SafetyAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SafetyAlert"> | string
    title?: StringWithAggregatesFilter<"SafetyAlert"> | string
    description?: StringWithAggregatesFilter<"SafetyAlert"> | string
    severity?: EnumAlertSeverityWithAggregatesFilter<"SafetyAlert"> | $Enums.AlertSeverity
    affectedAreas?: StringNullableListFilter<"SafetyAlert">
    issuedBy?: StringNullableWithAggregatesFilter<"SafetyAlert"> | string | null
    isActive?: BoolWithAggregatesFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SafetyAlert"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"SafetyAlert"> | Date | string | null
  }

  export type SafetyZoneWhereInput = {
    AND?: SafetyZoneWhereInput | SafetyZoneWhereInput[]
    OR?: SafetyZoneWhereInput[]
    NOT?: SafetyZoneWhereInput | SafetyZoneWhereInput[]
    id?: StringFilter<"SafetyZone"> | string
    areaName?: StringFilter<"SafetyZone"> | string
    safetyScore?: FloatFilter<"SafetyZone"> | number
    zoneLevel?: EnumZoneLevelFilter<"SafetyZone"> | $Enums.ZoneLevel
    polygon?: JsonNullableFilter<"SafetyZone">
    notes?: StringNullableFilter<"SafetyZone"> | string | null
    updatedAt?: DateTimeFilter<"SafetyZone"> | Date | string
  }

  export type SafetyZoneOrderByWithRelationInput = {
    id?: SortOrder
    areaName?: SortOrder
    safetyScore?: SortOrder
    zoneLevel?: SortOrder
    polygon?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyZoneWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SafetyZoneWhereInput | SafetyZoneWhereInput[]
    OR?: SafetyZoneWhereInput[]
    NOT?: SafetyZoneWhereInput | SafetyZoneWhereInput[]
    areaName?: StringFilter<"SafetyZone"> | string
    safetyScore?: FloatFilter<"SafetyZone"> | number
    zoneLevel?: EnumZoneLevelFilter<"SafetyZone"> | $Enums.ZoneLevel
    polygon?: JsonNullableFilter<"SafetyZone">
    notes?: StringNullableFilter<"SafetyZone"> | string | null
    updatedAt?: DateTimeFilter<"SafetyZone"> | Date | string
  }, "id">

  export type SafetyZoneOrderByWithAggregationInput = {
    id?: SortOrder
    areaName?: SortOrder
    safetyScore?: SortOrder
    zoneLevel?: SortOrder
    polygon?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: SafetyZoneCountOrderByAggregateInput
    _avg?: SafetyZoneAvgOrderByAggregateInput
    _max?: SafetyZoneMaxOrderByAggregateInput
    _min?: SafetyZoneMinOrderByAggregateInput
    _sum?: SafetyZoneSumOrderByAggregateInput
  }

  export type SafetyZoneScalarWhereWithAggregatesInput = {
    AND?: SafetyZoneScalarWhereWithAggregatesInput | SafetyZoneScalarWhereWithAggregatesInput[]
    OR?: SafetyZoneScalarWhereWithAggregatesInput[]
    NOT?: SafetyZoneScalarWhereWithAggregatesInput | SafetyZoneScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SafetyZone"> | string
    areaName?: StringWithAggregatesFilter<"SafetyZone"> | string
    safetyScore?: FloatWithAggregatesFilter<"SafetyZone"> | number
    zoneLevel?: EnumZoneLevelWithAggregatesFilter<"SafetyZone"> | $Enums.ZoneLevel
    polygon?: JsonNullableWithAggregatesFilter<"SafetyZone">
    notes?: StringNullableWithAggregatesFilter<"SafetyZone"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"SafetyZone"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogUncheckedCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitUncheckedCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketUncheckedCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUncheckedUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUncheckedUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUncheckedUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogCreateInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    speed?: number | null
    heading?: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp?: Date | string
    user: UserCreateNestedOneWithoutLocationLogsInput
  }

  export type LocationLogUncheckedCreateInput = {
    id?: string
    userId: string
    latitude: number
    longitude: number
    accuracy?: number | null
    speed?: number | null
    heading?: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp?: Date | string
  }

  export type LocationLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLocationLogsNestedInput
  }

  export type LocationLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogCreateManyInput = {
    id?: string
    userId: string
    latitude: number
    longitude: number
    accuracy?: number | null
    speed?: number | null
    heading?: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp?: Date | string
  }

  export type LocationLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmergencyContactCreateInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    relation: string
    user: UserCreateNestedOneWithoutEmergencyContactsInput
  }

  export type EmergencyContactUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    phone: string
    email?: string | null
    relation: string
  }

  export type EmergencyContactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutEmergencyContactsNestedInput
  }

  export type EmergencyContactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactCreateManyInput = {
    id?: string
    userId: string
    name: string
    phone: string
    email?: string | null
    relation: string
  }

  export type EmergencyContactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
  }

  export type ItineraryCreateInput = {
    id?: string
    startLocation: string
    endLocation: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutItinerariesInput
  }

  export type ItineraryUncheckedCreateInput = {
    id?: string
    userId: string
    startLocation: string
    endLocation: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutItinerariesNestedInput
  }

  export type ItineraryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryCreateManyInput = {
    id?: string
    userId: string
    startLocation: string
    endLocation: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookingPartnerCreateInput = {
    id?: string
    name: string
    description: string
    url: string
    logoUrl?: string | null
    category: string
    isVerified?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    visits?: BookingVisitCreateNestedManyWithoutPartnerInput
  }

  export type BookingPartnerUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    url: string
    logoUrl?: string | null
    category: string
    isVerified?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    visits?: BookingVisitUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type BookingPartnerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visits?: BookingVisitUpdateManyWithoutPartnerNestedInput
  }

  export type BookingPartnerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visits?: BookingVisitUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type BookingPartnerCreateManyInput = {
    id?: string
    name: string
    description: string
    url: string
    logoUrl?: string | null
    category: string
    isVerified?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingPartnerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingPartnerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingVisitCreateInput = {
    id?: string
    durationMs: number
    visitedAt?: Date | string
    user: UserCreateNestedOneWithoutBookingVisitsInput
    partner: BookingPartnerCreateNestedOneWithoutVisitsInput
  }

  export type BookingVisitUncheckedCreateInput = {
    id?: string
    userId: string
    partnerId: string
    durationMs: number
    visitedAt?: Date | string
  }

  export type BookingVisitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookingVisitsNestedInput
    partner?: BookingPartnerUpdateOneRequiredWithoutVisitsNestedInput
  }

  export type BookingVisitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingVisitCreateManyInput = {
    id?: string
    userId: string
    partnerId: string
    durationMs: number
    visitedAt?: Date | string
  }

  export type BookingVisitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingVisitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SOSAlertCreateInput = {
    id?: string
    status?: $Enums.SOSStatus
    latitude?: number | null
    longitude?: number | null
    address?: string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: Date | string | null
    cancelledAt?: Date | string | null
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSosAlertsInput
  }

  export type SOSAlertUncheckedCreateInput = {
    id?: string
    userId: string
    status?: $Enums.SOSStatus
    latitude?: number | null
    longitude?: number | null
    address?: string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: Date | string | null
    cancelledAt?: Date | string | null
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SOSAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSosAlertsNestedInput
  }

  export type SOSAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SOSAlertCreateManyInput = {
    id?: string
    userId: string
    status?: $Enums.SOSStatus
    latitude?: number | null
    longitude?: number | null
    address?: string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: Date | string | null
    cancelledAt?: Date | string | null
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SOSAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SOSAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportTicketCreateInput = {
    id?: string
    ticketNumber?: number
    name: string
    email: string
    subject: string
    message: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutSupportTicketsInput
  }

  export type SupportTicketUncheckedCreateInput = {
    id?: string
    ticketNumber?: number
    userId?: string | null
    name: string
    email: string
    subject: string
    message: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportTicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutSupportTicketsNestedInput
  }

  export type SupportTicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportTicketCreateManyInput = {
    id?: string
    ticketNumber?: number
    userId?: string | null
    name: string
    email: string
    subject: string
    message: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportTicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportTicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: IntFieldUpdateOperationsInput | number
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAlertCreateInput = {
    id?: string
    title: string
    description: string
    severity: $Enums.AlertSeverity
    affectedAreas?: SafetyAlertCreateaffectedAreasInput | string[]
    issuedBy?: string | null
    isActive?: boolean
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type SafetyAlertUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    severity: $Enums.AlertSeverity
    affectedAreas?: SafetyAlertCreateaffectedAreasInput | string[]
    issuedBy?: string | null
    isActive?: boolean
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type SafetyAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    affectedAreas?: SafetyAlertUpdateaffectedAreasInput | string[]
    issuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SafetyAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    affectedAreas?: SafetyAlertUpdateaffectedAreasInput | string[]
    issuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SafetyAlertCreateManyInput = {
    id?: string
    title: string
    description: string
    severity: $Enums.AlertSeverity
    affectedAreas?: SafetyAlertCreateaffectedAreasInput | string[]
    issuedBy?: string | null
    isActive?: boolean
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type SafetyAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    affectedAreas?: SafetyAlertUpdateaffectedAreasInput | string[]
    issuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SafetyAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    severity?: EnumAlertSeverityFieldUpdateOperationsInput | $Enums.AlertSeverity
    affectedAreas?: SafetyAlertUpdateaffectedAreasInput | string[]
    issuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SafetyZoneCreateInput = {
    id?: string
    areaName: string
    safetyScore: number
    zoneLevel: $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    updatedAt?: Date | string
  }

  export type SafetyZoneUncheckedCreateInput = {
    id?: string
    areaName: string
    safetyScore: number
    zoneLevel: $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    updatedAt?: Date | string
  }

  export type SafetyZoneUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    areaName?: StringFieldUpdateOperationsInput | string
    safetyScore?: FloatFieldUpdateOperationsInput | number
    zoneLevel?: EnumZoneLevelFieldUpdateOperationsInput | $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyZoneUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    areaName?: StringFieldUpdateOperationsInput | string
    safetyScore?: FloatFieldUpdateOperationsInput | number
    zoneLevel?: EnumZoneLevelFieldUpdateOperationsInput | $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyZoneCreateManyInput = {
    id?: string
    areaName: string
    safetyScore: number
    zoneLevel: $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    updatedAt?: Date | string
  }

  export type SafetyZoneUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    areaName?: StringFieldUpdateOperationsInput | string
    safetyScore?: FloatFieldUpdateOperationsInput | number
    zoneLevel?: EnumZoneLevelFieldUpdateOperationsInput | $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyZoneUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    areaName?: StringFieldUpdateOperationsInput | string
    safetyScore?: FloatFieldUpdateOperationsInput | number
    zoneLevel?: EnumZoneLevelFieldUpdateOperationsInput | $Enums.ZoneLevel
    polygon?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LocationLogListRelationFilter = {
    every?: LocationLogWhereInput
    some?: LocationLogWhereInput
    none?: LocationLogWhereInput
  }

  export type EmergencyContactListRelationFilter = {
    every?: EmergencyContactWhereInput
    some?: EmergencyContactWhereInput
    none?: EmergencyContactWhereInput
  }

  export type ItineraryListRelationFilter = {
    every?: ItineraryWhereInput
    some?: ItineraryWhereInput
    none?: ItineraryWhereInput
  }

  export type BookingVisitListRelationFilter = {
    every?: BookingVisitWhereInput
    some?: BookingVisitWhereInput
    none?: BookingVisitWhereInput
  }

  export type SupportTicketListRelationFilter = {
    every?: SupportTicketWhereInput
    some?: SupportTicketWhereInput
    none?: SupportTicketWhereInput
  }

  export type SOSAlertListRelationFilter = {
    every?: SOSAlertWhereInput
    some?: SOSAlertWhereInput
    none?: SOSAlertWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocationLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmergencyContactOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItineraryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingVisitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupportTicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SOSAlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumLocationSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationSource | EnumLocationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationSourceFilter<$PrismaModel> | $Enums.LocationSource
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LocationLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    riskScore?: SortOrder
    source?: SortOrder
    timestamp?: SortOrder
  }

  export type LocationLogAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    riskScore?: SortOrder
  }

  export type LocationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    riskScore?: SortOrder
    source?: SortOrder
    timestamp?: SortOrder
  }

  export type LocationLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    riskScore?: SortOrder
    source?: SortOrder
    timestamp?: SortOrder
  }

  export type LocationLogSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    accuracy?: SortOrder
    speed?: SortOrder
    heading?: SortOrder
    riskScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumLocationSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationSource | EnumLocationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationSourceWithAggregatesFilter<$PrismaModel> | $Enums.LocationSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationSourceFilter<$PrismaModel>
    _max?: NestedEnumLocationSourceFilter<$PrismaModel>
  }

  export type EmergencyContactCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    relation?: SortOrder
  }

  export type EmergencyContactMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    relation?: SortOrder
  }

  export type EmergencyContactMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    relation?: SortOrder
  }

  export type EnumItineraryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItineraryStatus | EnumItineraryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItineraryStatusFilter<$PrismaModel> | $Enums.ItineraryStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ItineraryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    startLocation?: SortOrder
    endLocation?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    checklist?: SortOrder
  }

  export type ItineraryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    startLocation?: SortOrder
    endLocation?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
  }

  export type ItineraryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    startLocation?: SortOrder
    endLocation?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
  }

  export type EnumItineraryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItineraryStatus | EnumItineraryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItineraryStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItineraryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItineraryStatusFilter<$PrismaModel>
    _max?: NestedEnumItineraryStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BookingPartnerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    logoUrl?: SortOrder
    category?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingPartnerAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type BookingPartnerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    logoUrl?: SortOrder
    category?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingPartnerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    url?: SortOrder
    logoUrl?: SortOrder
    category?: SortOrder
    isVerified?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingPartnerSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BookingPartnerRelationFilter = {
    is?: BookingPartnerWhereInput
    isNot?: BookingPartnerWhereInput
  }

  export type BookingVisitCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    partnerId?: SortOrder
    durationMs?: SortOrder
    visitedAt?: SortOrder
  }

  export type BookingVisitAvgOrderByAggregateInput = {
    durationMs?: SortOrder
  }

  export type BookingVisitMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    partnerId?: SortOrder
    durationMs?: SortOrder
    visitedAt?: SortOrder
  }

  export type BookingVisitMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    partnerId?: SortOrder
    durationMs?: SortOrder
    visitedAt?: SortOrder
  }

  export type BookingVisitSumOrderByAggregateInput = {
    durationMs?: SortOrder
  }

  export type EnumSOSStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SOSStatus | EnumSOSStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSOSStatusFilter<$PrismaModel> | $Enums.SOSStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SOSAlertCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    emergencyContacts?: SortOrder
    resolvedAt?: SortOrder
    cancelledAt?: SortOrder
    acknowledgedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SOSAlertAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type SOSAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    resolvedAt?: SortOrder
    cancelledAt?: SortOrder
    acknowledgedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SOSAlertMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    resolvedAt?: SortOrder
    cancelledAt?: SortOrder
    acknowledgedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SOSAlertSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type EnumSOSStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SOSStatus | EnumSOSStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSOSStatusWithAggregatesFilter<$PrismaModel> | $Enums.SOSStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSOSStatusFilter<$PrismaModel>
    _max?: NestedEnumSOSStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SupportTicketCountOrderByAggregateInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupportTicketAvgOrderByAggregateInput = {
    ticketNumber?: SortOrder
  }

  export type SupportTicketMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupportTicketMinOrderByAggregateInput = {
    id?: SortOrder
    ticketNumber?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupportTicketSumOrderByAggregateInput = {
    ticketNumber?: SortOrder
  }

  export type EnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type EnumAlertSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityFilter<$PrismaModel> | $Enums.AlertSeverity
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type SafetyAlertCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    severity?: SortOrder
    affectedAreas?: SortOrder
    issuedBy?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type SafetyAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    severity?: SortOrder
    issuedBy?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type SafetyAlertMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    severity?: SortOrder
    issuedBy?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type EnumAlertSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityWithAggregatesFilter<$PrismaModel> | $Enums.AlertSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertSeverityFilter<$PrismaModel>
    _max?: NestedEnumAlertSeverityFilter<$PrismaModel>
  }

  export type EnumZoneLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ZoneLevel | EnumZoneLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumZoneLevelFilter<$PrismaModel> | $Enums.ZoneLevel
  }

  export type SafetyZoneCountOrderByAggregateInput = {
    id?: SortOrder
    areaName?: SortOrder
    safetyScore?: SortOrder
    zoneLevel?: SortOrder
    polygon?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyZoneAvgOrderByAggregateInput = {
    safetyScore?: SortOrder
  }

  export type SafetyZoneMaxOrderByAggregateInput = {
    id?: SortOrder
    areaName?: SortOrder
    safetyScore?: SortOrder
    zoneLevel?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyZoneMinOrderByAggregateInput = {
    id?: SortOrder
    areaName?: SortOrder
    safetyScore?: SortOrder
    zoneLevel?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyZoneSumOrderByAggregateInput = {
    safetyScore?: SortOrder
  }

  export type EnumZoneLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ZoneLevel | EnumZoneLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumZoneLevelWithAggregatesFilter<$PrismaModel> | $Enums.ZoneLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumZoneLevelFilter<$PrismaModel>
    _max?: NestedEnumZoneLevelFilter<$PrismaModel>
  }

  export type LocationLogCreateNestedManyWithoutUserInput = {
    create?: XOR<LocationLogCreateWithoutUserInput, LocationLogUncheckedCreateWithoutUserInput> | LocationLogCreateWithoutUserInput[] | LocationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutUserInput | LocationLogCreateOrConnectWithoutUserInput[]
    createMany?: LocationLogCreateManyUserInputEnvelope
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
  }

  export type EmergencyContactCreateNestedManyWithoutUserInput = {
    create?: XOR<EmergencyContactCreateWithoutUserInput, EmergencyContactUncheckedCreateWithoutUserInput> | EmergencyContactCreateWithoutUserInput[] | EmergencyContactUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutUserInput | EmergencyContactCreateOrConnectWithoutUserInput[]
    createMany?: EmergencyContactCreateManyUserInputEnvelope
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
  }

  export type ItineraryCreateNestedManyWithoutUserInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
  }

  export type BookingVisitCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingVisitCreateWithoutUserInput, BookingVisitUncheckedCreateWithoutUserInput> | BookingVisitCreateWithoutUserInput[] | BookingVisitUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutUserInput | BookingVisitCreateOrConnectWithoutUserInput[]
    createMany?: BookingVisitCreateManyUserInputEnvelope
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
  }

  export type SupportTicketCreateNestedManyWithoutUserInput = {
    create?: XOR<SupportTicketCreateWithoutUserInput, SupportTicketUncheckedCreateWithoutUserInput> | SupportTicketCreateWithoutUserInput[] | SupportTicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupportTicketCreateOrConnectWithoutUserInput | SupportTicketCreateOrConnectWithoutUserInput[]
    createMany?: SupportTicketCreateManyUserInputEnvelope
    connect?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
  }

  export type SOSAlertCreateNestedManyWithoutUserInput = {
    create?: XOR<SOSAlertCreateWithoutUserInput, SOSAlertUncheckedCreateWithoutUserInput> | SOSAlertCreateWithoutUserInput[] | SOSAlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SOSAlertCreateOrConnectWithoutUserInput | SOSAlertCreateOrConnectWithoutUserInput[]
    createMany?: SOSAlertCreateManyUserInputEnvelope
    connect?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
  }

  export type LocationLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LocationLogCreateWithoutUserInput, LocationLogUncheckedCreateWithoutUserInput> | LocationLogCreateWithoutUserInput[] | LocationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutUserInput | LocationLogCreateOrConnectWithoutUserInput[]
    createMany?: LocationLogCreateManyUserInputEnvelope
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
  }

  export type EmergencyContactUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EmergencyContactCreateWithoutUserInput, EmergencyContactUncheckedCreateWithoutUserInput> | EmergencyContactCreateWithoutUserInput[] | EmergencyContactUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutUserInput | EmergencyContactCreateOrConnectWithoutUserInput[]
    createMany?: EmergencyContactCreateManyUserInputEnvelope
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
  }

  export type ItineraryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
  }

  export type BookingVisitUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingVisitCreateWithoutUserInput, BookingVisitUncheckedCreateWithoutUserInput> | BookingVisitCreateWithoutUserInput[] | BookingVisitUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutUserInput | BookingVisitCreateOrConnectWithoutUserInput[]
    createMany?: BookingVisitCreateManyUserInputEnvelope
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
  }

  export type SupportTicketUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SupportTicketCreateWithoutUserInput, SupportTicketUncheckedCreateWithoutUserInput> | SupportTicketCreateWithoutUserInput[] | SupportTicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupportTicketCreateOrConnectWithoutUserInput | SupportTicketCreateOrConnectWithoutUserInput[]
    createMany?: SupportTicketCreateManyUserInputEnvelope
    connect?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
  }

  export type SOSAlertUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SOSAlertCreateWithoutUserInput, SOSAlertUncheckedCreateWithoutUserInput> | SOSAlertCreateWithoutUserInput[] | SOSAlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SOSAlertCreateOrConnectWithoutUserInput | SOSAlertCreateOrConnectWithoutUserInput[]
    createMany?: SOSAlertCreateManyUserInputEnvelope
    connect?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LocationLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<LocationLogCreateWithoutUserInput, LocationLogUncheckedCreateWithoutUserInput> | LocationLogCreateWithoutUserInput[] | LocationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutUserInput | LocationLogCreateOrConnectWithoutUserInput[]
    upsert?: LocationLogUpsertWithWhereUniqueWithoutUserInput | LocationLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LocationLogCreateManyUserInputEnvelope
    set?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    disconnect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    delete?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    update?: LocationLogUpdateWithWhereUniqueWithoutUserInput | LocationLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LocationLogUpdateManyWithWhereWithoutUserInput | LocationLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
  }

  export type EmergencyContactUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmergencyContactCreateWithoutUserInput, EmergencyContactUncheckedCreateWithoutUserInput> | EmergencyContactCreateWithoutUserInput[] | EmergencyContactUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutUserInput | EmergencyContactCreateOrConnectWithoutUserInput[]
    upsert?: EmergencyContactUpsertWithWhereUniqueWithoutUserInput | EmergencyContactUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmergencyContactCreateManyUserInputEnvelope
    set?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    disconnect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    delete?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    update?: EmergencyContactUpdateWithWhereUniqueWithoutUserInput | EmergencyContactUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmergencyContactUpdateManyWithWhereWithoutUserInput | EmergencyContactUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
  }

  export type ItineraryUpdateManyWithoutUserNestedInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    upsert?: ItineraryUpsertWithWhereUniqueWithoutUserInput | ItineraryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    set?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    disconnect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    delete?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    update?: ItineraryUpdateWithWhereUniqueWithoutUserInput | ItineraryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ItineraryUpdateManyWithWhereWithoutUserInput | ItineraryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
  }

  export type BookingVisitUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingVisitCreateWithoutUserInput, BookingVisitUncheckedCreateWithoutUserInput> | BookingVisitCreateWithoutUserInput[] | BookingVisitUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutUserInput | BookingVisitCreateOrConnectWithoutUserInput[]
    upsert?: BookingVisitUpsertWithWhereUniqueWithoutUserInput | BookingVisitUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingVisitCreateManyUserInputEnvelope
    set?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    disconnect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    delete?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    update?: BookingVisitUpdateWithWhereUniqueWithoutUserInput | BookingVisitUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingVisitUpdateManyWithWhereWithoutUserInput | BookingVisitUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingVisitScalarWhereInput | BookingVisitScalarWhereInput[]
  }

  export type SupportTicketUpdateManyWithoutUserNestedInput = {
    create?: XOR<SupportTicketCreateWithoutUserInput, SupportTicketUncheckedCreateWithoutUserInput> | SupportTicketCreateWithoutUserInput[] | SupportTicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupportTicketCreateOrConnectWithoutUserInput | SupportTicketCreateOrConnectWithoutUserInput[]
    upsert?: SupportTicketUpsertWithWhereUniqueWithoutUserInput | SupportTicketUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SupportTicketCreateManyUserInputEnvelope
    set?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    disconnect?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    delete?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    connect?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    update?: SupportTicketUpdateWithWhereUniqueWithoutUserInput | SupportTicketUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SupportTicketUpdateManyWithWhereWithoutUserInput | SupportTicketUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SupportTicketScalarWhereInput | SupportTicketScalarWhereInput[]
  }

  export type SOSAlertUpdateManyWithoutUserNestedInput = {
    create?: XOR<SOSAlertCreateWithoutUserInput, SOSAlertUncheckedCreateWithoutUserInput> | SOSAlertCreateWithoutUserInput[] | SOSAlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SOSAlertCreateOrConnectWithoutUserInput | SOSAlertCreateOrConnectWithoutUserInput[]
    upsert?: SOSAlertUpsertWithWhereUniqueWithoutUserInput | SOSAlertUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SOSAlertCreateManyUserInputEnvelope
    set?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    disconnect?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    delete?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    connect?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    update?: SOSAlertUpdateWithWhereUniqueWithoutUserInput | SOSAlertUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SOSAlertUpdateManyWithWhereWithoutUserInput | SOSAlertUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SOSAlertScalarWhereInput | SOSAlertScalarWhereInput[]
  }

  export type LocationLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LocationLogCreateWithoutUserInput, LocationLogUncheckedCreateWithoutUserInput> | LocationLogCreateWithoutUserInput[] | LocationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LocationLogCreateOrConnectWithoutUserInput | LocationLogCreateOrConnectWithoutUserInput[]
    upsert?: LocationLogUpsertWithWhereUniqueWithoutUserInput | LocationLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LocationLogCreateManyUserInputEnvelope
    set?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    disconnect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    delete?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    connect?: LocationLogWhereUniqueInput | LocationLogWhereUniqueInput[]
    update?: LocationLogUpdateWithWhereUniqueWithoutUserInput | LocationLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LocationLogUpdateManyWithWhereWithoutUserInput | LocationLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
  }

  export type EmergencyContactUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmergencyContactCreateWithoutUserInput, EmergencyContactUncheckedCreateWithoutUserInput> | EmergencyContactCreateWithoutUserInput[] | EmergencyContactUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutUserInput | EmergencyContactCreateOrConnectWithoutUserInput[]
    upsert?: EmergencyContactUpsertWithWhereUniqueWithoutUserInput | EmergencyContactUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmergencyContactCreateManyUserInputEnvelope
    set?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    disconnect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    delete?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    update?: EmergencyContactUpdateWithWhereUniqueWithoutUserInput | EmergencyContactUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmergencyContactUpdateManyWithWhereWithoutUserInput | EmergencyContactUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
  }

  export type ItineraryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput> | ItineraryCreateWithoutUserInput[] | ItineraryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ItineraryCreateOrConnectWithoutUserInput | ItineraryCreateOrConnectWithoutUserInput[]
    upsert?: ItineraryUpsertWithWhereUniqueWithoutUserInput | ItineraryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ItineraryCreateManyUserInputEnvelope
    set?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    disconnect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    delete?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    connect?: ItineraryWhereUniqueInput | ItineraryWhereUniqueInput[]
    update?: ItineraryUpdateWithWhereUniqueWithoutUserInput | ItineraryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ItineraryUpdateManyWithWhereWithoutUserInput | ItineraryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
  }

  export type BookingVisitUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingVisitCreateWithoutUserInput, BookingVisitUncheckedCreateWithoutUserInput> | BookingVisitCreateWithoutUserInput[] | BookingVisitUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutUserInput | BookingVisitCreateOrConnectWithoutUserInput[]
    upsert?: BookingVisitUpsertWithWhereUniqueWithoutUserInput | BookingVisitUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingVisitCreateManyUserInputEnvelope
    set?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    disconnect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    delete?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    update?: BookingVisitUpdateWithWhereUniqueWithoutUserInput | BookingVisitUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingVisitUpdateManyWithWhereWithoutUserInput | BookingVisitUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingVisitScalarWhereInput | BookingVisitScalarWhereInput[]
  }

  export type SupportTicketUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SupportTicketCreateWithoutUserInput, SupportTicketUncheckedCreateWithoutUserInput> | SupportTicketCreateWithoutUserInput[] | SupportTicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupportTicketCreateOrConnectWithoutUserInput | SupportTicketCreateOrConnectWithoutUserInput[]
    upsert?: SupportTicketUpsertWithWhereUniqueWithoutUserInput | SupportTicketUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SupportTicketCreateManyUserInputEnvelope
    set?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    disconnect?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    delete?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    connect?: SupportTicketWhereUniqueInput | SupportTicketWhereUniqueInput[]
    update?: SupportTicketUpdateWithWhereUniqueWithoutUserInput | SupportTicketUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SupportTicketUpdateManyWithWhereWithoutUserInput | SupportTicketUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SupportTicketScalarWhereInput | SupportTicketScalarWhereInput[]
  }

  export type SOSAlertUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SOSAlertCreateWithoutUserInput, SOSAlertUncheckedCreateWithoutUserInput> | SOSAlertCreateWithoutUserInput[] | SOSAlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SOSAlertCreateOrConnectWithoutUserInput | SOSAlertCreateOrConnectWithoutUserInput[]
    upsert?: SOSAlertUpsertWithWhereUniqueWithoutUserInput | SOSAlertUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SOSAlertCreateManyUserInputEnvelope
    set?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    disconnect?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    delete?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    connect?: SOSAlertWhereUniqueInput | SOSAlertWhereUniqueInput[]
    update?: SOSAlertUpdateWithWhereUniqueWithoutUserInput | SOSAlertUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SOSAlertUpdateManyWithWhereWithoutUserInput | SOSAlertUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SOSAlertScalarWhereInput | SOSAlertScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLocationLogsInput = {
    create?: XOR<UserCreateWithoutLocationLogsInput, UserUncheckedCreateWithoutLocationLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLocationLogsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumLocationSourceFieldUpdateOperationsInput = {
    set?: $Enums.LocationSource
  }

  export type UserUpdateOneRequiredWithoutLocationLogsNestedInput = {
    create?: XOR<UserCreateWithoutLocationLogsInput, UserUncheckedCreateWithoutLocationLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLocationLogsInput
    upsert?: UserUpsertWithoutLocationLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLocationLogsInput, UserUpdateWithoutLocationLogsInput>, UserUncheckedUpdateWithoutLocationLogsInput>
  }

  export type UserCreateNestedOneWithoutEmergencyContactsInput = {
    create?: XOR<UserCreateWithoutEmergencyContactsInput, UserUncheckedCreateWithoutEmergencyContactsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmergencyContactsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutEmergencyContactsNestedInput = {
    create?: XOR<UserCreateWithoutEmergencyContactsInput, UserUncheckedCreateWithoutEmergencyContactsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmergencyContactsInput
    upsert?: UserUpsertWithoutEmergencyContactsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEmergencyContactsInput, UserUpdateWithoutEmergencyContactsInput>, UserUncheckedUpdateWithoutEmergencyContactsInput>
  }

  export type UserCreateNestedOneWithoutItinerariesInput = {
    create?: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutItinerariesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumItineraryStatusFieldUpdateOperationsInput = {
    set?: $Enums.ItineraryStatus
  }

  export type UserUpdateOneRequiredWithoutItinerariesNestedInput = {
    create?: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutItinerariesInput
    upsert?: UserUpsertWithoutItinerariesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutItinerariesInput, UserUpdateWithoutItinerariesInput>, UserUncheckedUpdateWithoutItinerariesInput>
  }

  export type BookingVisitCreateNestedManyWithoutPartnerInput = {
    create?: XOR<BookingVisitCreateWithoutPartnerInput, BookingVisitUncheckedCreateWithoutPartnerInput> | BookingVisitCreateWithoutPartnerInput[] | BookingVisitUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutPartnerInput | BookingVisitCreateOrConnectWithoutPartnerInput[]
    createMany?: BookingVisitCreateManyPartnerInputEnvelope
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
  }

  export type BookingVisitUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<BookingVisitCreateWithoutPartnerInput, BookingVisitUncheckedCreateWithoutPartnerInput> | BookingVisitCreateWithoutPartnerInput[] | BookingVisitUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutPartnerInput | BookingVisitCreateOrConnectWithoutPartnerInput[]
    createMany?: BookingVisitCreateManyPartnerInputEnvelope
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BookingVisitUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<BookingVisitCreateWithoutPartnerInput, BookingVisitUncheckedCreateWithoutPartnerInput> | BookingVisitCreateWithoutPartnerInput[] | BookingVisitUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutPartnerInput | BookingVisitCreateOrConnectWithoutPartnerInput[]
    upsert?: BookingVisitUpsertWithWhereUniqueWithoutPartnerInput | BookingVisitUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: BookingVisitCreateManyPartnerInputEnvelope
    set?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    disconnect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    delete?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    update?: BookingVisitUpdateWithWhereUniqueWithoutPartnerInput | BookingVisitUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: BookingVisitUpdateManyWithWhereWithoutPartnerInput | BookingVisitUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: BookingVisitScalarWhereInput | BookingVisitScalarWhereInput[]
  }

  export type BookingVisitUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<BookingVisitCreateWithoutPartnerInput, BookingVisitUncheckedCreateWithoutPartnerInput> | BookingVisitCreateWithoutPartnerInput[] | BookingVisitUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: BookingVisitCreateOrConnectWithoutPartnerInput | BookingVisitCreateOrConnectWithoutPartnerInput[]
    upsert?: BookingVisitUpsertWithWhereUniqueWithoutPartnerInput | BookingVisitUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: BookingVisitCreateManyPartnerInputEnvelope
    set?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    disconnect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    delete?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    connect?: BookingVisitWhereUniqueInput | BookingVisitWhereUniqueInput[]
    update?: BookingVisitUpdateWithWhereUniqueWithoutPartnerInput | BookingVisitUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: BookingVisitUpdateManyWithWhereWithoutPartnerInput | BookingVisitUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: BookingVisitScalarWhereInput | BookingVisitScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBookingVisitsInput = {
    create?: XOR<UserCreateWithoutBookingVisitsInput, UserUncheckedCreateWithoutBookingVisitsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingVisitsInput
    connect?: UserWhereUniqueInput
  }

  export type BookingPartnerCreateNestedOneWithoutVisitsInput = {
    create?: XOR<BookingPartnerCreateWithoutVisitsInput, BookingPartnerUncheckedCreateWithoutVisitsInput>
    connectOrCreate?: BookingPartnerCreateOrConnectWithoutVisitsInput
    connect?: BookingPartnerWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBookingVisitsNestedInput = {
    create?: XOR<UserCreateWithoutBookingVisitsInput, UserUncheckedCreateWithoutBookingVisitsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingVisitsInput
    upsert?: UserUpsertWithoutBookingVisitsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookingVisitsInput, UserUpdateWithoutBookingVisitsInput>, UserUncheckedUpdateWithoutBookingVisitsInput>
  }

  export type BookingPartnerUpdateOneRequiredWithoutVisitsNestedInput = {
    create?: XOR<BookingPartnerCreateWithoutVisitsInput, BookingPartnerUncheckedCreateWithoutVisitsInput>
    connectOrCreate?: BookingPartnerCreateOrConnectWithoutVisitsInput
    upsert?: BookingPartnerUpsertWithoutVisitsInput
    connect?: BookingPartnerWhereUniqueInput
    update?: XOR<XOR<BookingPartnerUpdateToOneWithWhereWithoutVisitsInput, BookingPartnerUpdateWithoutVisitsInput>, BookingPartnerUncheckedUpdateWithoutVisitsInput>
  }

  export type UserCreateNestedOneWithoutSosAlertsInput = {
    create?: XOR<UserCreateWithoutSosAlertsInput, UserUncheckedCreateWithoutSosAlertsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSosAlertsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumSOSStatusFieldUpdateOperationsInput = {
    set?: $Enums.SOSStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSosAlertsNestedInput = {
    create?: XOR<UserCreateWithoutSosAlertsInput, UserUncheckedCreateWithoutSosAlertsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSosAlertsInput
    upsert?: UserUpsertWithoutSosAlertsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSosAlertsInput, UserUpdateWithoutSosAlertsInput>, UserUncheckedUpdateWithoutSosAlertsInput>
  }

  export type UserCreateNestedOneWithoutSupportTicketsInput = {
    create?: XOR<UserCreateWithoutSupportTicketsInput, UserUncheckedCreateWithoutSupportTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSupportTicketsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus
  }

  export type UserUpdateOneWithoutSupportTicketsNestedInput = {
    create?: XOR<UserCreateWithoutSupportTicketsInput, UserUncheckedCreateWithoutSupportTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSupportTicketsInput
    upsert?: UserUpsertWithoutSupportTicketsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSupportTicketsInput, UserUpdateWithoutSupportTicketsInput>, UserUncheckedUpdateWithoutSupportTicketsInput>
  }

  export type SafetyAlertCreateaffectedAreasInput = {
    set: string[]
  }

  export type EnumAlertSeverityFieldUpdateOperationsInput = {
    set?: $Enums.AlertSeverity
  }

  export type SafetyAlertUpdateaffectedAreasInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumZoneLevelFieldUpdateOperationsInput = {
    set?: $Enums.ZoneLevel
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumLocationSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationSource | EnumLocationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationSourceFilter<$PrismaModel> | $Enums.LocationSource
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumLocationSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationSource | EnumLocationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationSource[] | ListEnumLocationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationSourceWithAggregatesFilter<$PrismaModel> | $Enums.LocationSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationSourceFilter<$PrismaModel>
    _max?: NestedEnumLocationSourceFilter<$PrismaModel>
  }

  export type NestedEnumItineraryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItineraryStatus | EnumItineraryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItineraryStatusFilter<$PrismaModel> | $Enums.ItineraryStatus
  }

  export type NestedEnumItineraryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItineraryStatus | EnumItineraryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItineraryStatus[] | ListEnumItineraryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumItineraryStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItineraryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItineraryStatusFilter<$PrismaModel>
    _max?: NestedEnumItineraryStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumSOSStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SOSStatus | EnumSOSStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSOSStatusFilter<$PrismaModel> | $Enums.SOSStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumSOSStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SOSStatus | EnumSOSStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SOSStatus[] | ListEnumSOSStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSOSStatusWithAggregatesFilter<$PrismaModel> | $Enums.SOSStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSOSStatusFilter<$PrismaModel>
    _max?: NestedEnumSOSStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TicketStatus[] | ListEnumTicketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type NestedEnumAlertSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityFilter<$PrismaModel> | $Enums.AlertSeverity
  }

  export type NestedEnumAlertSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertSeverity | EnumAlertSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertSeverity[] | ListEnumAlertSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertSeverityWithAggregatesFilter<$PrismaModel> | $Enums.AlertSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertSeverityFilter<$PrismaModel>
    _max?: NestedEnumAlertSeverityFilter<$PrismaModel>
  }

  export type NestedEnumZoneLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ZoneLevel | EnumZoneLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumZoneLevelFilter<$PrismaModel> | $Enums.ZoneLevel
  }

  export type NestedEnumZoneLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ZoneLevel | EnumZoneLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZoneLevel[] | ListEnumZoneLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumZoneLevelWithAggregatesFilter<$PrismaModel> | $Enums.ZoneLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumZoneLevelFilter<$PrismaModel>
    _max?: NestedEnumZoneLevelFilter<$PrismaModel>
  }

  export type LocationLogCreateWithoutUserInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    speed?: number | null
    heading?: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp?: Date | string
  }

  export type LocationLogUncheckedCreateWithoutUserInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    speed?: number | null
    heading?: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp?: Date | string
  }

  export type LocationLogCreateOrConnectWithoutUserInput = {
    where: LocationLogWhereUniqueInput
    create: XOR<LocationLogCreateWithoutUserInput, LocationLogUncheckedCreateWithoutUserInput>
  }

  export type LocationLogCreateManyUserInputEnvelope = {
    data: LocationLogCreateManyUserInput | LocationLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EmergencyContactCreateWithoutUserInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    relation: string
  }

  export type EmergencyContactUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    relation: string
  }

  export type EmergencyContactCreateOrConnectWithoutUserInput = {
    where: EmergencyContactWhereUniqueInput
    create: XOR<EmergencyContactCreateWithoutUserInput, EmergencyContactUncheckedCreateWithoutUserInput>
  }

  export type EmergencyContactCreateManyUserInputEnvelope = {
    data: EmergencyContactCreateManyUserInput | EmergencyContactCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ItineraryCreateWithoutUserInput = {
    id?: string
    startLocation: string
    endLocation: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryUncheckedCreateWithoutUserInput = {
    id?: string
    startLocation: string
    endLocation: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryCreateOrConnectWithoutUserInput = {
    where: ItineraryWhereUniqueInput
    create: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput>
  }

  export type ItineraryCreateManyUserInputEnvelope = {
    data: ItineraryCreateManyUserInput | ItineraryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BookingVisitCreateWithoutUserInput = {
    id?: string
    durationMs: number
    visitedAt?: Date | string
    partner: BookingPartnerCreateNestedOneWithoutVisitsInput
  }

  export type BookingVisitUncheckedCreateWithoutUserInput = {
    id?: string
    partnerId: string
    durationMs: number
    visitedAt?: Date | string
  }

  export type BookingVisitCreateOrConnectWithoutUserInput = {
    where: BookingVisitWhereUniqueInput
    create: XOR<BookingVisitCreateWithoutUserInput, BookingVisitUncheckedCreateWithoutUserInput>
  }

  export type BookingVisitCreateManyUserInputEnvelope = {
    data: BookingVisitCreateManyUserInput | BookingVisitCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SupportTicketCreateWithoutUserInput = {
    id?: string
    ticketNumber?: number
    name: string
    email: string
    subject: string
    message: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportTicketUncheckedCreateWithoutUserInput = {
    id?: string
    ticketNumber?: number
    name: string
    email: string
    subject: string
    message: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupportTicketCreateOrConnectWithoutUserInput = {
    where: SupportTicketWhereUniqueInput
    create: XOR<SupportTicketCreateWithoutUserInput, SupportTicketUncheckedCreateWithoutUserInput>
  }

  export type SupportTicketCreateManyUserInputEnvelope = {
    data: SupportTicketCreateManyUserInput | SupportTicketCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SOSAlertCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SOSStatus
    latitude?: number | null
    longitude?: number | null
    address?: string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: Date | string | null
    cancelledAt?: Date | string | null
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SOSAlertUncheckedCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SOSStatus
    latitude?: number | null
    longitude?: number | null
    address?: string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: Date | string | null
    cancelledAt?: Date | string | null
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SOSAlertCreateOrConnectWithoutUserInput = {
    where: SOSAlertWhereUniqueInput
    create: XOR<SOSAlertCreateWithoutUserInput, SOSAlertUncheckedCreateWithoutUserInput>
  }

  export type SOSAlertCreateManyUserInputEnvelope = {
    data: SOSAlertCreateManyUserInput | SOSAlertCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LocationLogUpsertWithWhereUniqueWithoutUserInput = {
    where: LocationLogWhereUniqueInput
    update: XOR<LocationLogUpdateWithoutUserInput, LocationLogUncheckedUpdateWithoutUserInput>
    create: XOR<LocationLogCreateWithoutUserInput, LocationLogUncheckedCreateWithoutUserInput>
  }

  export type LocationLogUpdateWithWhereUniqueWithoutUserInput = {
    where: LocationLogWhereUniqueInput
    data: XOR<LocationLogUpdateWithoutUserInput, LocationLogUncheckedUpdateWithoutUserInput>
  }

  export type LocationLogUpdateManyWithWhereWithoutUserInput = {
    where: LocationLogScalarWhereInput
    data: XOR<LocationLogUpdateManyMutationInput, LocationLogUncheckedUpdateManyWithoutUserInput>
  }

  export type LocationLogScalarWhereInput = {
    AND?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
    OR?: LocationLogScalarWhereInput[]
    NOT?: LocationLogScalarWhereInput | LocationLogScalarWhereInput[]
    id?: StringFilter<"LocationLog"> | string
    userId?: StringFilter<"LocationLog"> | string
    latitude?: FloatFilter<"LocationLog"> | number
    longitude?: FloatFilter<"LocationLog"> | number
    accuracy?: FloatNullableFilter<"LocationLog"> | number | null
    speed?: FloatNullableFilter<"LocationLog"> | number | null
    heading?: FloatNullableFilter<"LocationLog"> | number | null
    riskScore?: IntFilter<"LocationLog"> | number
    source?: EnumLocationSourceFilter<"LocationLog"> | $Enums.LocationSource
    timestamp?: DateTimeFilter<"LocationLog"> | Date | string
  }

  export type EmergencyContactUpsertWithWhereUniqueWithoutUserInput = {
    where: EmergencyContactWhereUniqueInput
    update: XOR<EmergencyContactUpdateWithoutUserInput, EmergencyContactUncheckedUpdateWithoutUserInput>
    create: XOR<EmergencyContactCreateWithoutUserInput, EmergencyContactUncheckedCreateWithoutUserInput>
  }

  export type EmergencyContactUpdateWithWhereUniqueWithoutUserInput = {
    where: EmergencyContactWhereUniqueInput
    data: XOR<EmergencyContactUpdateWithoutUserInput, EmergencyContactUncheckedUpdateWithoutUserInput>
  }

  export type EmergencyContactUpdateManyWithWhereWithoutUserInput = {
    where: EmergencyContactScalarWhereInput
    data: XOR<EmergencyContactUpdateManyMutationInput, EmergencyContactUncheckedUpdateManyWithoutUserInput>
  }

  export type EmergencyContactScalarWhereInput = {
    AND?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
    OR?: EmergencyContactScalarWhereInput[]
    NOT?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
    id?: StringFilter<"EmergencyContact"> | string
    userId?: StringFilter<"EmergencyContact"> | string
    name?: StringFilter<"EmergencyContact"> | string
    phone?: StringFilter<"EmergencyContact"> | string
    email?: StringNullableFilter<"EmergencyContact"> | string | null
    relation?: StringFilter<"EmergencyContact"> | string
  }

  export type ItineraryUpsertWithWhereUniqueWithoutUserInput = {
    where: ItineraryWhereUniqueInput
    update: XOR<ItineraryUpdateWithoutUserInput, ItineraryUncheckedUpdateWithoutUserInput>
    create: XOR<ItineraryCreateWithoutUserInput, ItineraryUncheckedCreateWithoutUserInput>
  }

  export type ItineraryUpdateWithWhereUniqueWithoutUserInput = {
    where: ItineraryWhereUniqueInput
    data: XOR<ItineraryUpdateWithoutUserInput, ItineraryUncheckedUpdateWithoutUserInput>
  }

  export type ItineraryUpdateManyWithWhereWithoutUserInput = {
    where: ItineraryScalarWhereInput
    data: XOR<ItineraryUpdateManyMutationInput, ItineraryUncheckedUpdateManyWithoutUserInput>
  }

  export type ItineraryScalarWhereInput = {
    AND?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
    OR?: ItineraryScalarWhereInput[]
    NOT?: ItineraryScalarWhereInput | ItineraryScalarWhereInput[]
    id?: StringFilter<"Itinerary"> | string
    userId?: StringFilter<"Itinerary"> | string
    startLocation?: StringFilter<"Itinerary"> | string
    endLocation?: StringFilter<"Itinerary"> | string
    startTime?: DateTimeFilter<"Itinerary"> | Date | string
    endTime?: DateTimeFilter<"Itinerary"> | Date | string
    status?: EnumItineraryStatusFilter<"Itinerary"> | $Enums.ItineraryStatus
    checklist?: JsonNullableFilter<"Itinerary">
  }

  export type BookingVisitUpsertWithWhereUniqueWithoutUserInput = {
    where: BookingVisitWhereUniqueInput
    update: XOR<BookingVisitUpdateWithoutUserInput, BookingVisitUncheckedUpdateWithoutUserInput>
    create: XOR<BookingVisitCreateWithoutUserInput, BookingVisitUncheckedCreateWithoutUserInput>
  }

  export type BookingVisitUpdateWithWhereUniqueWithoutUserInput = {
    where: BookingVisitWhereUniqueInput
    data: XOR<BookingVisitUpdateWithoutUserInput, BookingVisitUncheckedUpdateWithoutUserInput>
  }

  export type BookingVisitUpdateManyWithWhereWithoutUserInput = {
    where: BookingVisitScalarWhereInput
    data: XOR<BookingVisitUpdateManyMutationInput, BookingVisitUncheckedUpdateManyWithoutUserInput>
  }

  export type BookingVisitScalarWhereInput = {
    AND?: BookingVisitScalarWhereInput | BookingVisitScalarWhereInput[]
    OR?: BookingVisitScalarWhereInput[]
    NOT?: BookingVisitScalarWhereInput | BookingVisitScalarWhereInput[]
    id?: StringFilter<"BookingVisit"> | string
    userId?: StringFilter<"BookingVisit"> | string
    partnerId?: StringFilter<"BookingVisit"> | string
    durationMs?: IntFilter<"BookingVisit"> | number
    visitedAt?: DateTimeFilter<"BookingVisit"> | Date | string
  }

  export type SupportTicketUpsertWithWhereUniqueWithoutUserInput = {
    where: SupportTicketWhereUniqueInput
    update: XOR<SupportTicketUpdateWithoutUserInput, SupportTicketUncheckedUpdateWithoutUserInput>
    create: XOR<SupportTicketCreateWithoutUserInput, SupportTicketUncheckedCreateWithoutUserInput>
  }

  export type SupportTicketUpdateWithWhereUniqueWithoutUserInput = {
    where: SupportTicketWhereUniqueInput
    data: XOR<SupportTicketUpdateWithoutUserInput, SupportTicketUncheckedUpdateWithoutUserInput>
  }

  export type SupportTicketUpdateManyWithWhereWithoutUserInput = {
    where: SupportTicketScalarWhereInput
    data: XOR<SupportTicketUpdateManyMutationInput, SupportTicketUncheckedUpdateManyWithoutUserInput>
  }

  export type SupportTicketScalarWhereInput = {
    AND?: SupportTicketScalarWhereInput | SupportTicketScalarWhereInput[]
    OR?: SupportTicketScalarWhereInput[]
    NOT?: SupportTicketScalarWhereInput | SupportTicketScalarWhereInput[]
    id?: StringFilter<"SupportTicket"> | string
    ticketNumber?: IntFilter<"SupportTicket"> | number
    userId?: StringNullableFilter<"SupportTicket"> | string | null
    name?: StringFilter<"SupportTicket"> | string
    email?: StringFilter<"SupportTicket"> | string
    subject?: StringFilter<"SupportTicket"> | string
    message?: StringFilter<"SupportTicket"> | string
    status?: EnumTicketStatusFilter<"SupportTicket"> | $Enums.TicketStatus
    createdAt?: DateTimeFilter<"SupportTicket"> | Date | string
    updatedAt?: DateTimeFilter<"SupportTicket"> | Date | string
  }

  export type SOSAlertUpsertWithWhereUniqueWithoutUserInput = {
    where: SOSAlertWhereUniqueInput
    update: XOR<SOSAlertUpdateWithoutUserInput, SOSAlertUncheckedUpdateWithoutUserInput>
    create: XOR<SOSAlertCreateWithoutUserInput, SOSAlertUncheckedCreateWithoutUserInput>
  }

  export type SOSAlertUpdateWithWhereUniqueWithoutUserInput = {
    where: SOSAlertWhereUniqueInput
    data: XOR<SOSAlertUpdateWithoutUserInput, SOSAlertUncheckedUpdateWithoutUserInput>
  }

  export type SOSAlertUpdateManyWithWhereWithoutUserInput = {
    where: SOSAlertScalarWhereInput
    data: XOR<SOSAlertUpdateManyMutationInput, SOSAlertUncheckedUpdateManyWithoutUserInput>
  }

  export type SOSAlertScalarWhereInput = {
    AND?: SOSAlertScalarWhereInput | SOSAlertScalarWhereInput[]
    OR?: SOSAlertScalarWhereInput[]
    NOT?: SOSAlertScalarWhereInput | SOSAlertScalarWhereInput[]
    id?: StringFilter<"SOSAlert"> | string
    userId?: StringFilter<"SOSAlert"> | string
    status?: EnumSOSStatusFilter<"SOSAlert"> | $Enums.SOSStatus
    latitude?: FloatNullableFilter<"SOSAlert"> | number | null
    longitude?: FloatNullableFilter<"SOSAlert"> | number | null
    address?: StringNullableFilter<"SOSAlert"> | string | null
    emergencyContacts?: JsonNullableFilter<"SOSAlert">
    resolvedAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    acknowledgedAt?: DateTimeNullableFilter<"SOSAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"SOSAlert"> | Date | string
    updatedAt?: DateTimeFilter<"SOSAlert"> | Date | string
  }

  export type UserCreateWithoutLocationLogsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLocationLogsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitUncheckedCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketUncheckedCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLocationLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLocationLogsInput, UserUncheckedCreateWithoutLocationLogsInput>
  }

  export type UserUpsertWithoutLocationLogsInput = {
    update: XOR<UserUpdateWithoutLocationLogsInput, UserUncheckedUpdateWithoutLocationLogsInput>
    create: XOR<UserCreateWithoutLocationLogsInput, UserUncheckedCreateWithoutLocationLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLocationLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLocationLogsInput, UserUncheckedUpdateWithoutLocationLogsInput>
  }

  export type UserUpdateWithoutLocationLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emergencyContacts?: EmergencyContactUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLocationLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUncheckedUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUncheckedUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutEmergencyContactsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEmergencyContactsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitUncheckedCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketUncheckedCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEmergencyContactsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEmergencyContactsInput, UserUncheckedCreateWithoutEmergencyContactsInput>
  }

  export type UserUpsertWithoutEmergencyContactsInput = {
    update: XOR<UserUpdateWithoutEmergencyContactsInput, UserUncheckedUpdateWithoutEmergencyContactsInput>
    create: XOR<UserCreateWithoutEmergencyContactsInput, UserUncheckedCreateWithoutEmergencyContactsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEmergencyContactsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEmergencyContactsInput, UserUncheckedUpdateWithoutEmergencyContactsInput>
  }

  export type UserUpdateWithoutEmergencyContactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEmergencyContactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUncheckedUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUncheckedUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutItinerariesInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutItinerariesInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogUncheckedCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitUncheckedCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketUncheckedCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutItinerariesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
  }

  export type UserUpsertWithoutItinerariesInput = {
    update: XOR<UserUpdateWithoutItinerariesInput, UserUncheckedUpdateWithoutItinerariesInput>
    create: XOR<UserCreateWithoutItinerariesInput, UserUncheckedCreateWithoutItinerariesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutItinerariesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutItinerariesInput, UserUncheckedUpdateWithoutItinerariesInput>
  }

  export type UserUpdateWithoutItinerariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutItinerariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUncheckedUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUncheckedUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUncheckedUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BookingVisitCreateWithoutPartnerInput = {
    id?: string
    durationMs: number
    visitedAt?: Date | string
    user: UserCreateNestedOneWithoutBookingVisitsInput
  }

  export type BookingVisitUncheckedCreateWithoutPartnerInput = {
    id?: string
    userId: string
    durationMs: number
    visitedAt?: Date | string
  }

  export type BookingVisitCreateOrConnectWithoutPartnerInput = {
    where: BookingVisitWhereUniqueInput
    create: XOR<BookingVisitCreateWithoutPartnerInput, BookingVisitUncheckedCreateWithoutPartnerInput>
  }

  export type BookingVisitCreateManyPartnerInputEnvelope = {
    data: BookingVisitCreateManyPartnerInput | BookingVisitCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type BookingVisitUpsertWithWhereUniqueWithoutPartnerInput = {
    where: BookingVisitWhereUniqueInput
    update: XOR<BookingVisitUpdateWithoutPartnerInput, BookingVisitUncheckedUpdateWithoutPartnerInput>
    create: XOR<BookingVisitCreateWithoutPartnerInput, BookingVisitUncheckedCreateWithoutPartnerInput>
  }

  export type BookingVisitUpdateWithWhereUniqueWithoutPartnerInput = {
    where: BookingVisitWhereUniqueInput
    data: XOR<BookingVisitUpdateWithoutPartnerInput, BookingVisitUncheckedUpdateWithoutPartnerInput>
  }

  export type BookingVisitUpdateManyWithWhereWithoutPartnerInput = {
    where: BookingVisitScalarWhereInput
    data: XOR<BookingVisitUpdateManyMutationInput, BookingVisitUncheckedUpdateManyWithoutPartnerInput>
  }

  export type UserCreateWithoutBookingVisitsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBookingVisitsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogUncheckedCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketUncheckedCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBookingVisitsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookingVisitsInput, UserUncheckedCreateWithoutBookingVisitsInput>
  }

  export type BookingPartnerCreateWithoutVisitsInput = {
    id?: string
    name: string
    description: string
    url: string
    logoUrl?: string | null
    category: string
    isVerified?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingPartnerUncheckedCreateWithoutVisitsInput = {
    id?: string
    name: string
    description: string
    url: string
    logoUrl?: string | null
    category: string
    isVerified?: boolean
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingPartnerCreateOrConnectWithoutVisitsInput = {
    where: BookingPartnerWhereUniqueInput
    create: XOR<BookingPartnerCreateWithoutVisitsInput, BookingPartnerUncheckedCreateWithoutVisitsInput>
  }

  export type UserUpsertWithoutBookingVisitsInput = {
    update: XOR<UserUpdateWithoutBookingVisitsInput, UserUncheckedUpdateWithoutBookingVisitsInput>
    create: XOR<UserCreateWithoutBookingVisitsInput, UserUncheckedCreateWithoutBookingVisitsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookingVisitsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookingVisitsInput, UserUncheckedUpdateWithoutBookingVisitsInput>
  }

  export type UserUpdateWithoutBookingVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBookingVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUncheckedUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUncheckedUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BookingPartnerUpsertWithoutVisitsInput = {
    update: XOR<BookingPartnerUpdateWithoutVisitsInput, BookingPartnerUncheckedUpdateWithoutVisitsInput>
    create: XOR<BookingPartnerCreateWithoutVisitsInput, BookingPartnerUncheckedCreateWithoutVisitsInput>
    where?: BookingPartnerWhereInput
  }

  export type BookingPartnerUpdateToOneWithWhereWithoutVisitsInput = {
    where?: BookingPartnerWhereInput
    data: XOR<BookingPartnerUpdateWithoutVisitsInput, BookingPartnerUncheckedUpdateWithoutVisitsInput>
  }

  export type BookingPartnerUpdateWithoutVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingPartnerUncheckedUpdateWithoutVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSosAlertsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSosAlertsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogUncheckedCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitUncheckedCreateNestedManyWithoutUserInput
    supportTickets?: SupportTicketUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSosAlertsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSosAlertsInput, UserUncheckedCreateWithoutSosAlertsInput>
  }

  export type UserUpsertWithoutSosAlertsInput = {
    update: XOR<UserUpdateWithoutSosAlertsInput, UserUncheckedUpdateWithoutSosAlertsInput>
    create: XOR<UserCreateWithoutSosAlertsInput, UserUncheckedCreateWithoutSosAlertsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSosAlertsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSosAlertsInput, UserUncheckedUpdateWithoutSosAlertsInput>
  }

  export type UserUpdateWithoutSosAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSosAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUncheckedUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUncheckedUpdateManyWithoutUserNestedInput
    supportTickets?: SupportTicketUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSupportTicketsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutUserInput
    itineraries?: ItineraryCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSupportTicketsInput = {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role?: $Enums.UserRole
    avatar?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationLogs?: LocationLogUncheckedCreateNestedManyWithoutUserInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutUserInput
    itineraries?: ItineraryUncheckedCreateNestedManyWithoutUserInput
    bookingVisits?: BookingVisitUncheckedCreateNestedManyWithoutUserInput
    sosAlerts?: SOSAlertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSupportTicketsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSupportTicketsInput, UserUncheckedCreateWithoutSupportTicketsInput>
  }

  export type UserUpsertWithoutSupportTicketsInput = {
    update: XOR<UserUpdateWithoutSupportTicketsInput, UserUncheckedUpdateWithoutSupportTicketsInput>
    create: XOR<UserCreateWithoutSupportTicketsInput, UserUncheckedCreateWithoutSupportTicketsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSupportTicketsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSupportTicketsInput, UserUncheckedUpdateWithoutSupportTicketsInput>
  }

  export type UserUpdateWithoutSupportTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSupportTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationLogs?: LocationLogUncheckedUpdateManyWithoutUserNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutUserNestedInput
    itineraries?: ItineraryUncheckedUpdateManyWithoutUserNestedInput
    bookingVisits?: BookingVisitUncheckedUpdateManyWithoutUserNestedInput
    sosAlerts?: SOSAlertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LocationLogCreateManyUserInput = {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number | null
    speed?: number | null
    heading?: number | null
    riskScore: number
    source: $Enums.LocationSource
    timestamp?: Date | string
  }

  export type EmergencyContactCreateManyUserInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    relation: string
  }

  export type ItineraryCreateManyUserInput = {
    id?: string
    startLocation: string
    endLocation: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookingVisitCreateManyUserInput = {
    id?: string
    partnerId: string
    durationMs: number
    visitedAt?: Date | string
  }

  export type SupportTicketCreateManyUserInput = {
    id?: string
    ticketNumber?: number
    name: string
    email: string
    subject: string
    message: string
    status?: $Enums.TicketStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SOSAlertCreateManyUserInput = {
    id?: string
    status?: $Enums.SOSStatus
    latitude?: number | null
    longitude?: number | null
    address?: string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: Date | string | null
    cancelledAt?: Date | string | null
    acknowledgedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    speed?: NullableFloatFieldUpdateOperationsInput | number | null
    heading?: NullableFloatFieldUpdateOperationsInput | number | null
    riskScore?: IntFieldUpdateOperationsInput | number
    source?: EnumLocationSourceFieldUpdateOperationsInput | $Enums.LocationSource
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmergencyContactUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    relation?: StringFieldUpdateOperationsInput | string
  }

  export type ItineraryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ItineraryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startLocation?: StringFieldUpdateOperationsInput | string
    endLocation?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumItineraryStatusFieldUpdateOperationsInput | $Enums.ItineraryStatus
    checklist?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookingVisitUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partner?: BookingPartnerUpdateOneRequiredWithoutVisitsNestedInput
  }

  export type BookingVisitUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingVisitUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportTicketUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportTicketUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupportTicketUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SOSAlertUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SOSAlertUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SOSAlertUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSOSStatusFieldUpdateOperationsInput | $Enums.SOSStatus
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContacts?: NullableJsonNullValueInput | InputJsonValue
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingVisitCreateManyPartnerInput = {
    id?: string
    userId: string
    durationMs: number
    visitedAt?: Date | string
  }

  export type BookingVisitUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookingVisitsNestedInput
  }

  export type BookingVisitUncheckedUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingVisitUncheckedUpdateManyWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    durationMs?: IntFieldUpdateOperationsInput | number
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingPartnerCountOutputTypeDefaultArgs instead
     */
    export type BookingPartnerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingPartnerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LocationLogDefaultArgs instead
     */
    export type LocationLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LocationLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmergencyContactDefaultArgs instead
     */
    export type EmergencyContactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmergencyContactDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItineraryDefaultArgs instead
     */
    export type ItineraryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItineraryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingPartnerDefaultArgs instead
     */
    export type BookingPartnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingPartnerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingVisitDefaultArgs instead
     */
    export type BookingVisitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingVisitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SOSAlertDefaultArgs instead
     */
    export type SOSAlertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SOSAlertDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SupportTicketDefaultArgs instead
     */
    export type SupportTicketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SupportTicketDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SafetyAlertDefaultArgs instead
     */
    export type SafetyAlertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SafetyAlertDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SafetyZoneDefaultArgs instead
     */
    export type SafetyZoneArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SafetyZoneDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}