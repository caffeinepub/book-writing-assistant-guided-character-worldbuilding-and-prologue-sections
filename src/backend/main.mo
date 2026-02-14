import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration function on upgrade
(with migration = Migration.run)
actor {
  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Character = {
    name : Text;
    background : Text;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  public type WorldbuildingCategory = {
    description : Text;
    freeformNotes : List.List<Text>;
  };

  public type Prologue = {
    hook : Text;
    povVoice : Text;
    stakes : Text;
    keyReveals : Text;
    connectionToChapterOne : Text;
    draft : Text;
  };

  public type BookProject = {
    id : Text;
    name : Text;
    owner : Principal;
    characters : Map.Map<Text, Character>;
    worldbuilding : Map.Map<Text, WorldbuildingCategory>;
    prologue : ?Prologue;
    characterAnswers : Map.Map<Text, CharacterQuestionnaireAnswers>;
  };

  public type BookSetupAnswers = {
    characters : [BookSetupCharacterAnswers];
    worldbuilding : [BookSetupWorldbuildingCategoryAnswers];
    hasPrologue : Bool;
  };

  public type BookSetupCharacterAnswers = {
    name : Text;
    background : Text;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    role : Text;
  };

  public type BookSetupWorldbuildingCategoryAnswers = {
    categoryName : Text;
    description : Text;
    freeformNotes : [Text];
  };

  public type CharacterQuestionnaireWorkflow = {
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  public type CharacterQuestionnaireAnswers = {
    hasCompletedBackground : Bool;
    hasCompletedOtherSections : Bool;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  public type CharacterView = {
    name : Text;
    background : Text;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  public type WorldbuildingCategoryView = {
    description : Text;
    freeformNotes : [Text];
  };

  public type PrologueView = {
    hook : Text;
    povVoice : Text;
    stakes : Text;
    keyReveals : Text;
    connectionToChapterOne : Text;
    draft : Text;
  };

  public type BookProjectView = {
    id : Text;
    name : Text;
    characters : [CharacterView];
    worldbuilding : [WorldbuildingCategoryView];
    prologue : ?PrologueView;
  };

  module Character {
    public func compare(a : Character, b : Character) : {
      #less;
      #equal;
      #greater;
    } {
      Text.compare(a.name, b.name);
    };
  };

  func toCharacterView(character : Character) : CharacterView {
    {
      name = character.name;
      background = character.background;
      motivations = character.motivations;
      relationships = character.relationships;
      flaws = character.flaws;
      voice = character.voice;
      storyRole = character.storyRole;
    };
  };

  func toWorldbuildingCategoryView(category : WorldbuildingCategory) : WorldbuildingCategoryView {
    {
      description = category.description;
      freeformNotes = category.freeformNotes.toArray();
    };
  };

  func toPrologueView(prologue : Prologue) : PrologueView {
    prologue;
  };

  func toBookProjectView(project : BookProject) : BookProjectView {
    {
      id = project.id;
      name = project.name;
      characters = project.characters.values().toArray().sort().map(func(c) { toCharacterView(c) });
      worldbuilding = project.worldbuilding.values().toArray().map(func(w) { toWorldbuildingCategoryView(w) });
      prologue = switch (project.prologue) {
        case (null) { null };
        case (?p) { ?toPrologueView(p) };
      };
    };
  };

  func canAccessProject(caller : Principal, project : BookProject) : Bool {
    project.owner == caller or AccessControl.isAdmin(accessControlState, caller);
  };

  func canModifyProject(caller : Principal, project : BookProject) : Bool {
    project.owner == caller or AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func createProject(id : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    if (projects.containsKey(id)) { Runtime.trap("Project with this ID already exists!") };
    let newProject : BookProject = {
      id;
      name;
      owner = caller;
      characters = Map.empty<Text, Character>();
      worldbuilding = Map.empty<Text, WorldbuildingCategory>();
      prologue = null;
      characterAnswers = Map.empty<Text, CharacterQuestionnaireAnswers>();
    };
    projects.add(id, newProject);
  };

  public shared ({ caller }) func renameProject(id : Text, newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can rename projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) {
        if (not canModifyProject(caller, project)) {
          Runtime.trap("Unauthorized: You can only rename your own projects");
        };
        let updatedProject : BookProject = {
          project with
          name = newName;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) {
        if (not canModifyProject(caller, project)) {
          Runtime.trap("Unauthorized: You can only delete your own projects");
        };
        projects.remove(id);
      };
    };
  };

  public query ({ caller }) func getProject(id : Text) : async BookProjectView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) {
        if (not canAccessProject(caller, project)) {
          Runtime.trap("Unauthorized: You can only view your own projects");
        };
        toBookProjectView(project);
      };
    };
  };

  public query ({ caller }) func getAllProjects() : async [BookProjectView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    projects.values().toArray()
      .filter(func(p : BookProject) : Bool {
        isAdmin or p.owner == caller
      })
      .map(func(p) { toBookProjectView(p) });
  };

  public shared ({ caller }) func addCharacter(projectId : Text, name : Text, background : Text, motivations : Text, relationships : Text, flaws : Text, voice : Text, storyRole : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add characters");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only add characters to your own projects");
    };
    let newCharacter : Character = {
      name;
      background;
      motivations;
      relationships;
      flaws;
      voice;
      storyRole;
    };
    project.characters.add(name, newCharacter);
    projects.add(projectId, project);
  };

  // New batch API for creating multiple characters.
  public type CharacterInput = {
    name : Text;
    background : Text;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  public shared ({ caller }) func batchCreateCharacters(projectId : Text, characters : [CharacterInput]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add characters");
    };

    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };

    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only add characters to your own projects");
    };

    for (c in characters.values()) {
      let newCharacter : Character = c;
      project.characters.add(c.name, newCharacter);
    };
    projects.add(projectId, project);
  };

  public shared ({ caller }) func updateCharacter(projectId : Text, name : Text, background : Text, motivations : Text, relationships : Text, flaws : Text, voice : Text, storyRole : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update characters");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only update characters in your own projects");
    };

    if (not project.characters.containsKey(name)) { Runtime.trap("Character not found!") };

    let updatedCharacter : Character = {
      name;
      background;
      motivations;
      relationships;
      flaws;
      voice;
      storyRole;
    };

    project.characters.add(name, updatedCharacter);
    projects.add(projectId, project);
  };

  public shared ({ caller }) func updateWorldbuildingCategory(projectId : Text, categoryName : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update worldbuilding");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only update worldbuilding in your own projects");
    };
    let existingNotes = switch (project.worldbuilding.get(categoryName)) {
      case (null) { List.empty<Text>() };
      case (?cat) { cat.freeformNotes };
    };
    let newCategory : WorldbuildingCategory = {
      description;
      freeformNotes = existingNotes;
    };
    project.worldbuilding.add(categoryName, newCategory);
    projects.add(projectId, project);
  };

  public shared ({ caller }) func addWorldbuildingNote(projectId : Text, categoryName : Text, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add worldbuilding notes");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only add notes to your own projects");
    };
    let category = switch (project.worldbuilding.get(categoryName)) {
      case (null) { Runtime.trap("Category not found!") };
      case (?c) { c };
    };
    category.freeformNotes.add(note);
    project.worldbuilding.add(categoryName, category);
    projects.add(projectId, project);
  };

  public shared ({ caller }) func savePrologue(projectId : Text, hook : Text, povVoice : Text, stakes : Text, keyReveals : Text, connectionToChapterOne : Text, draft : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save prologues");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only save prologues in your own projects");
    };
    let newPrologue : Prologue = {
      hook;
      povVoice;
      stakes;
      keyReveals;
      connectionToChapterOne;
      draft;
    };
    let updatedProject : BookProject = {
      project with
      prologue = ?newPrologue;
    };
    projects.add(projectId, updatedProject);
  };

  public shared ({ caller }) func saveBookSetupAnswers(projectId : Text, answers : BookSetupAnswers) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save book setup answers");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only save setup answers for your own projects");
    };

    // Create characters from answers and add them to the project
    for (characterAnswer in answers.characters.values()) {
      let newCharacter : Character = {
        characterAnswer with storyRole = characterAnswer.role;
      };
      project.characters.add(newCharacter.name, newCharacter);
    };

    // Add worldbuilding categories from answers
    for (categoryAnswer in answers.worldbuilding.values()) {
      let notesList = List.fromArray(categoryAnswer.freeformNotes);
      let newCategory : WorldbuildingCategory = {
        description = categoryAnswer.description;
        freeformNotes = notesList;
      };
      project.worldbuilding.add(categoryAnswer.categoryName, newCategory);
    };

    projects.add(projectId, project);
  };

  // New function to save or update character questionnaire answers
  public shared ({ caller }) func saveCharacterQuestionnaireAnswers(projectId : Text, characterName : Text, answers : CharacterQuestionnaireAnswers) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save character questionnaire answers");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only save questionnaire answers for your own projects");
    };

    project.characterAnswers.add(characterName, answers);

    // Check if all questionnaires for this character are completed
    let backgroundCompleted = answers.hasCompletedBackground;
    let otherSectionsCompleted = answers.hasCompletedOtherSections;

    if (backgroundCompleted and otherSectionsCompleted) {
      let newCharacter : Character = {
        name = characterName;
        background = "Background"; // Provide background value here
        motivations = answers.motivations;
        relationships = answers.relationships;
        flaws = answers.flaws;
        voice = answers.voice;
        storyRole = answers.storyRole;
      };
      project.characters.add(characterName, newCharacter);
    };

    projects.add(projectId, project);
  };

  public shared ({ caller }) func markBackgroundQuestionnaireComplete(projectId : Text, characterName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark background complete");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only mark background complete for your own projects");
    };

    // Retrieve existing answers or initialize new ones with default values
    let existingAnswers = switch (project.characterAnswers.get(characterName)) {
      case (null) {
        {
          hasCompletedBackground = false;
          hasCompletedOtherSections = false;
          motivations = "";
          relationships = "";
          flaws = "";
          voice = "";
          storyRole = "";
        };
      };
      case (?answers) { answers };
    };

    // Update only the hasCompletedBackground flag
    let updatedAnswers : CharacterQuestionnaireAnswers = {
      existingAnswers with
      hasCompletedBackground = true;
    };

    project.characterAnswers.add(characterName, updatedAnswers);
    projects.add(projectId, project);
  };

  public shared ({ caller }) func markBackgroundAndCreateCharacter(projectId : Text, characterName : Text, background : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark background complete and create character");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };
    if (not canModifyProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only mark background complete for your own projects");
    };

    // Retrieve existing answers or initialize new ones with default values
    let existingAnswers = switch (project.characterAnswers.get(characterName)) {
      case (null) {
        {
          hasCompletedBackground = false;
          hasCompletedOtherSections = false;
          motivations = "";
          relationships = "";
          flaws = "";
          voice = "";
          storyRole = "";
        };
      };
      case (?answers) { answers };
    };

    // Update hasCompletedBackground and create character
    let updatedAnswers : CharacterQuestionnaireAnswers = {
      existingAnswers with
      hasCompletedBackground = true;
      // Preserve other fields
    };

    project.characterAnswers.add(characterName, updatedAnswers);

    let newCharacter : Character = {
      name = characterName;
      background;
      motivations = updatedAnswers.motivations;
      relationships = updatedAnswers.relationships;
      flaws = updatedAnswers.flaws;
      voice = updatedAnswers.voice;
      storyRole = updatedAnswers.storyRole;
    };
    project.characters.add(characterName, newCharacter);

    projects.add(projectId, project);
  };

  public query ({ caller }) func getCharacterQuestionnaireAnswers(projectId : Text, characterName : Text) : async ?CharacterQuestionnaireAnswers {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view character questionnaire answers");
    };

    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
    };

    if (not canAccessProject(caller, project)) {
      Runtime.trap("Unauthorized: You can only view character questionnaire answers for your own projects");
    };

    project.characterAnswers.get(characterName);
  };

  let projects = Map.empty<Text, BookProject>();
};
