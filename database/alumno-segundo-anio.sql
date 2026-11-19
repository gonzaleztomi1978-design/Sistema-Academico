/* =============================================================================
   Test data: a second-year student
   Instituto Superior Cura Gabriel Brochero

   Creates the student Sofia Romero and marks every first-year subject of the
   active study plans as passed ("Aprobado"), so she can enroll in second-year
   subjects. There is no grades module yet: this is the only way to get a
   student with passed subjects.

     Email:          sofia@uni.edu
     Password:       1234
     Record number:  L-2002

   How to run it:
     - Run database/AcademicSystem.sql first.
     - Load the study plan and its subjects (Planes de Estudio).
     - SQL Server Management Studio: open this file and press F5.
     - Command line:  sqlcmd -S localhost\SQLEXPRESS -E -C -f 65001 -i alumno-segundo-anio.sql

   It is safe to run more than once. If you add first-year subjects later,
   run it again and they are marked as passed too.

   For development and testing only. Do not run it in production.
   ============================================================================= */

USE AcademicSystem;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @Email        NVARCHAR(255) = N'sofia@uni.edu';
DECLARE @FirstName    NVARCHAR(100) = N'Sof' + NCHAR(237) + N'a';   -- "Sofia" with an accent on the i
DECLARE @LastName     NVARCHAR(100) = N'Romero';
DECLARE @Cuil         CHAR(11)      = '27350000017';
DECLARE @Dni          VARCHAR(10)   = '35000001';
DECLARE @RecordNumber NVARCHAR(20)  = N'L-2002';
-- Hash of the password "1234", made by the backend (ASP.NET Core Identity PasswordHasher).
DECLARE @PasswordHash NVARCHAR(255) = N'AQAAAAIAAYagAAAAEJIt0tswpaDLt0v+vDluDTZbQCCYGfcVCDOxo69trNOQJzmuzvEz2OpDTRKFIio6WA==';

DECLARE @StudentRoleId INT = (SELECT Id FROM dbo.Roles WHERE Name = N'Student');

IF @StudentRoleId IS NULL
    THROW 50001, 'The Student role does not exist. Run database/AcademicSystem.sql first.', 1;

BEGIN TRANSACTION;

/* 1. User ------------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = @Email)
BEGIN
    IF EXISTS (SELECT 1 FROM dbo.Users WHERE Cuil = @Cuil)
        THROW 50002, 'Another user already has the CUIL 27350000017.', 1;

    INSERT INTO dbo.Users (FirstName, LastName, Cuil, RoleId, Email, PasswordHash, IsActive)
    VALUES (@FirstName, @LastName, @Cuil, @StudentRoleId, @Email, @PasswordHash, 1);
END;

DECLARE @UserId INT = (SELECT Id FROM dbo.Users WHERE Email = @Email);

IF (SELECT RoleId FROM dbo.Users WHERE Id = @UserId) <> @StudentRoleId
    THROW 50003, 'The user sofia@uni.edu already exists and is not a student.', 1;

/* 2. Student profile -------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM dbo.Students WHERE UserId = @UserId)
BEGIN
    IF EXISTS (SELECT 1 FROM dbo.Students WHERE Dni = @Dni OR RecordNumber = @RecordNumber)
        THROW 50004, 'Another student already has the DNI 35000001 or the record number L-2002.', 1;

    INSERT INTO dbo.Students (UserId, FirstName, LastName, Dni, RecordNumber)
    VALUES (@UserId, @FirstName, @LastName, @Dni, @RecordNumber);
END;

DECLARE @StudentId INT = (SELECT Id FROM dbo.Students WHERE UserId = @UserId);

/* 3. First-year subjects, passed -------------------------------------------- */
DECLARE @FirstYear TABLE (SubjectId INT PRIMARY KEY);

INSERT INTO @FirstYear (SubjectId)
SELECT DISTINCT sps.SubjectId
FROM dbo.StudyPlanSubjects AS sps
JOIN dbo.StudyPlans AS sp ON sp.Id = sps.StudyPlanId
WHERE sps.CourseYear = 1
  AND sp.IsActive = 1;

-- Enrollment in each first-year subject (commission A).
INSERT INTO dbo.StudentSubjects (StudentId, SubjectId, Section)
SELECT @StudentId, f.SubjectId, N'A'
FROM @FirstYear AS f
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.StudentSubjects AS ss
    WHERE ss.StudentId = @StudentId AND ss.SubjectId = f.SubjectId);

-- Course record with the final status "Aprobado".
UPDATE cr
SET cr.FinalStatus = N'Aprobado',
    cr.UpdatedAt = SYSDATETIME()
FROM dbo.CourseRecords AS cr
JOIN dbo.StudentSubjects AS ss ON ss.Id = cr.StudentSubjectId
JOIN @FirstYear AS f ON f.SubjectId = ss.SubjectId
WHERE ss.StudentId = @StudentId
  AND ISNULL(cr.FinalStatus, N'') <> N'Aprobado';

INSERT INTO dbo.CourseRecords (StudentSubjectId, FinalStatus)
SELECT ss.Id, N'Aprobado'
FROM dbo.StudentSubjects AS ss
JOIN @FirstYear AS f ON f.SubjectId = ss.SubjectId
WHERE ss.StudentId = @StudentId
  AND NOT EXISTS (SELECT 1 FROM dbo.CourseRecords AS cr WHERE cr.StudentSubjectId = ss.Id);

COMMIT TRANSACTION;

/* 4. Result ------------------------------------------------------------------ */
DECLARE @Passed INT = (
    SELECT COUNT(*)
    FROM dbo.StudentSubjects AS ss
    JOIN dbo.CourseRecords AS cr ON cr.StudentSubjectId = ss.Id
    WHERE ss.StudentId = @StudentId AND cr.FinalStatus = N'Aprobado');

IF @Passed = 0
    PRINT 'The student sofia@uni.edu / 1234 is ready, but there are no first-year subjects yet. Load the study plan and run this script again.';
ELSE
    PRINT CONCAT('The student sofia@uni.edu / 1234 is ready, with ', @Passed, ' passed first-year subjects.');
GO
