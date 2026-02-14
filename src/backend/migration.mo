import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type UserProfile = {
    name : Text;
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

  public type Actor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    projects : Map.Map<Text, BookProject>;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
