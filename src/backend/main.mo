import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

actor {
  type Character = {
    name : Text;
    background : Text;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  type WorldbuildingCategory = {
    description : Text;
    freeformNotes : List.List<Text>;
  };

  type Prologue = {
    hook : Text;
    povVoice : Text;
    stakes : Text;
    keyReveals : Text;
    connectionToChapterOne : Text;
    draft : Text;
  };

  type BookProject = {
    id : Text;
    name : Text;
    characters : Map.Map<Text, Character>;
    worldbuilding : Map.Map<Text, WorldbuildingCategory>;
    prologue : ?Prologue;
  };

  type CharacterView = {
    name : Text;
    background : Text;
    motivations : Text;
    relationships : Text;
    flaws : Text;
    voice : Text;
    storyRole : Text;
  };

  type WorldbuildingCategoryView = {
    description : Text;
    freeformNotes : [Text];
  };

  type PrologueView = {
    hook : Text;
    povVoice : Text;
    stakes : Text;
    keyReveals : Text;
    connectionToChapterOne : Text;
    draft : Text;
  };

  type BookProjectView = {
    id : Text;
    name : Text;
    characters : [CharacterView];
    worldbuilding : [WorldbuildingCategoryView];
    prologue : ?PrologueView;
  };

  module Character {
    public func compare(a : Character, b : Character) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let projects = Map.empty<Text, BookProject>();

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

  public shared ({ caller }) func createProject(id : Text, name : Text) : async () {
    if (projects.containsKey(id)) { Runtime.trap("Project with this ID already exists!") };
    let newProject : BookProject = {
      id;
      name;
      characters = Map.empty<Text, Character>();
      worldbuilding = Map.empty<Text, WorldbuildingCategory>();
      prologue = null;
    };
    projects.add(id, newProject);
  };

  public shared ({ caller }) func renameProject(id : Text, newName : Text) : async () {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) {
        let updatedProject : BookProject = {
          project with
          name = newName;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async () {
    if (not projects.containsKey(id)) { Runtime.trap("Project not found!") };
    projects.remove(id);
  };

  public query ({ caller }) func getProject(id : Text) : async BookProjectView {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) { toBookProjectView(project) };
    };
  };

  public shared ({ caller }) func addCharacter(projectId : Text, name : Text, background : Text, motivations : Text, relationships : Text, flaws : Text, voice : Text, storyRole : Text) : async () {
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
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

  public shared ({ caller }) func updateWorldbuildingCategory(projectId : Text, categoryName : Text, description : Text) : async () {
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
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
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
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
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?p) { p };
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

  public query ({ caller }) func getAllProjects() : async [BookProjectView] {
    projects.values().toArray().map(func(p) { toBookProjectView(p) });
  };
};
